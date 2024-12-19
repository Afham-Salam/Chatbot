import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Subscription() {
    const navigate=useNavigate()
  return (
    <button
        className=" mt-5 w-full text-center bg-gray-800 py-2 hover:scale-105 rounded hover:bg-gray-700 transition"
        onClick={() => navigate('/subscription-plan')}
      >
       Subscription Plan
      </button>
  )
}
