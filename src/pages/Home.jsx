import React, { useRef, useState } from "react";
import axios from "axios";

export default function Home() {
  const [response,setResponse]=useState()
  const inputRef = useRef(null);

  const handleSend = async () => {
    const query = {
      message: inputRef.current.value,
    };
    console.log(query);

    // Retrieve the token from localStorage (or wherever it's stored)
    const token = localStorage.getItem("token");  // or use a different storage method

    try {
      const response = await axios.post(
        "http://45.159.221.50:9093/chatbot/query",
        query,
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Pass the token in the Authorization header
          },
        }
      );
      console.log(response.data.reply);
      setResponse(response.data.reply)
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <>
       <output className="bg-slate-400 text-white">
       
       {response}
  </output>
    
    <div className="bg-black h-screen w-full flex  items-end  gap-4 justify-center">
     
     <input
        type="text"
        className=" text-black px-4 py-2 rounded"
        ref={inputRef}
        placeholder="Type your message"
      />
      <button
        onClick={handleSend}
        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition"
      >
        Send
      </button>
     
      
     
    </div>
    </>
  );
}
