import { resolveSoa } from 'dns'
import { unstable_getServerSession } from 'next-auth'
import React from 'react'
import { Message } from '../typings'
import ChatInput from './ChatInput'
import MessageList from './MessageList'
import { Providers } from './providers'

type Props = {}

async function HomePage({}: Props) {
  

  const data = await fetch(`${process.env.VERCEL_URL}/api/getMessages`).then((res) => res.json())
  const messages:Message[] = data.messages;
  // console.log(data)
  // console.log(messages)
  const session = await unstable_getServerSession();
  return (
    <Providers session={session}>
       <main>
        {/* <h1>wELCOME TO META</h1> */}
        {/* Messages */}
        <MessageList initialMessages={messages}/>
        {/* chat input */}
        <ChatInput  session={session} />
    </main>

         </Providers>
   
  )
}

export default HomePage