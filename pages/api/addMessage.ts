// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { servicesVersion } from 'typescript';
import { serverPusher } from '../../pusher';
import redis from '../../redis';
import { Message } from '../../typings';

type Data = {
  message: Message
}

type ErrorData = {
  body: string
}

export default async function handler( //make this async as it is going to fetch in data..>
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {

  if(req.method !== 'POST') {
    res.status(405).json({ body: 'Method Not Allowed'})
    return;
  } //if the method is not a post request

    const {message} = req.body;
    // ....> copying the old content
    // and replacing the created_at with that of vthe server
    const newMessage = {
      ...message,
      created_at: Date.now()
    }

  
  // pushing to redis
 await redis.hset("messages", message.id, JSON.stringify(newMessage));
 serverPusher.trigger('messages', "new-message", newMessage);
//  type mesage
// pusher.trigger("my-channel", "my-event", {
//   message: "hello world"
// // });

  
  res.status(200).json({ message:  newMessage}) //return messages as new messages
}
