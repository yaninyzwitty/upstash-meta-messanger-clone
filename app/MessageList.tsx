"use client"

import { useEffect } from "react";
import useSWR from "swr";
import { clientPusher } from "../pusher";
import { Message } from "../typings";
import fetcher from '../utils/fetchMessages';
import MessageComponent from "./MessageComponent";
type Props = {
  initialMessages: Message[]
}

function MessageList({initialMessages}: Props) {
  const { data: messages,  error, mutate } = useSWR<Message[]>("/api/getMessages", fetcher);
  // console.log(messages)
  


  useEffect(() => {
    // client pusher ..new var ..> mesages and mutate
    const channel = clientPusher.subscribe('messages');
    
    channel.bind('new-message', async (data: Message) => {
      // no need to update cache
      if(messages?.find((message) => message.id === data?.id)) return;
      

      if(!messages){
        mutate(fetcher);
      }
      else {

        await mutate(fetcher, {
          optimisticData: [data, ...messages!],
          rollbackOnError: true,
          
        })
      }


     
    })
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
   
  }, [messages, mutate, clientPusher])
  
  return (
    <div className="space-y-5 px-5 pt-8 pb-32 max-w-2xl xl:max-w-4xl mx-auto">
      {( messages || initialMessages).map((message) => (
        <MessageComponent key={message.id} message={message} />
        
      ))}
      
        
    </div>
  )
}

export default MessageList