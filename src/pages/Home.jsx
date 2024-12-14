
import React, { useRef } from "react";
import axios from "axios";

export default function Home() {
  const inputRef = useRef(null);

  const handleSend = async () => {
    const query = {
      message:inputRef.current.value
    };
    console.log(query);

    try {
      const response = await axios.post(
        "http://45.159.221.50:9093/chatbot/query",
        query
      );
      console.log(response)
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  ///chatbot/query
  return (
    <div className="bg-black h-screen w-full">
      <input type="text" className="m-32" ref={inputRef} />
      <button onClick={handleSend} className="bg-white">
        Send
      </button>

      <output></output>
    </div>
  );
}
