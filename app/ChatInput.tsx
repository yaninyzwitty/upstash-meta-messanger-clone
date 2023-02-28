"use client";
import { unstable_getServerSession } from "next-auth";
import Image from "next/image";

import { FormEvent, useState } from "react";
import useSWR from "swr";
import { v4 as uuid } from "uuid";
import { Message } from "../typings";
import fetcher from "../utils/fetchMessages";
type Props = {
  session: Awaited<ReturnType<typeof unstable_getServerSession>>;
};
function ChatInput({ session }: Props) {
  const [input, setInput] = useState("");
  const { data: messages, error, mutate } = useSWR("/api/getMessages", fetcher);
  // console.log(messages)
  // console.log(session); //null why

  const addMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || !session) return;
    // sends the input of the user
    const messageToSend = input;
    setInput("");
    const id = uuid();
    //
    const message: Message = {
      id,
      message: messageToSend,
      created_at: Date.now(),
      username: session?.user?.name!,
      profilePic: session?.user?.image!,
      email: session?.user?.email!,
    };
    const uploadToUpstash = async () => {
      // const res = ...
      const data = await fetch("/api/addMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }), //so you acess it as { message }//the message object..>
      }).then((res) => res.json());

      return [data.message, ...messages!]; //messages fetched
      // const data = await res.json();
    };

    // uploadToUpstash();
    await mutate(uploadToUpstash, {
      optimisticData: [message, ...messages!],
      rollbackOnError: true,
    });
  };

  return (
    <form
      onSubmit={addMessage}
      className="fixed bottom-0 z-50 w-full flex px-10 py-5 space-x-2 border-gray-100 bg-white"
    >
      <input
        type="text"
        className="flex-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:rign-blue-600 focus:border-transparent px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder="Enter message here..."
        value={input}
        disabled={!session}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!input}
      >
        Send Message
      </button>
    </form>
  );
}

export default ChatInput;
