"use client"
import { signOut } from 'next-auth/react'
import React from 'react'




function LogoutButton() {
  return (
    <div>
    <button
    onClick={() => signOut()}  
    className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded'>
        Sign Out
        </button>

    </div>
  )
}

export default LogoutButton