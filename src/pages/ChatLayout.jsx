import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoIosSend, IoIosClose } from "react-icons/io";
import { CgMenuLeft } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

export default function ChatLayout() {
  const [messages, setMessages] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [typingMessage, setTypingMessage] = useState(""); // State for typing animation
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleSend = async () => {
    const userMessage = inputRef.current.value;

    if (!userMessage.trim()) return;

    const query = { message: userMessage };
    const token = localStorage.getItem("token");

    try {
      // Add user message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "question", text: userMessage },
      ]);

      // Clear the input box
      inputRef.current.value = "";

      // Simulate chatbot response
      const res = await axios.post(
        "http://45.159.221.50:9093/chatbot/query",
        query,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Start typing animation
      startTypingAnimation(res.data.reply);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const startTypingAnimation = (text) => {
    setTypingMessage(""); 
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setTypingMessage((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);

        // Add the full response to the chat messages
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "response", text },
        ]);
        setTypingMessage(""); 
      }
    }, 20); // Adjust typing speed here
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarVisible
            ? "w-72 border-r border-gray-500 sm:relative absolute "
            : "w-0 sm:w-0 sm:relative"
        } h-screen p-4 transition-all duration-300 bg-black z-40`}
      >
        {sidebarVisible && (
          <>
            <div className="flex justify-between items-center">
              <div className="text-gray-300 font-bold text-lg mb-4">ChatBot</div>
              <button
                onClick={() => setSidebarVisible(false)}
                className="text-white text-xl"
              >
                <IoIosClose />
              </button>
            </div>
            <button
              onClick={() => setMessages([])}
              className="mt-8 w-full text-center bg-gray-800 py-2 rounded hover:bg-gray-700 transition"
            >
              Clear All History
            </button>
            <button
              onClick={logout}
              className="mt-5 w-full text-center bg-gray-800 py-2 rounded hover:bg-gray-700 transition"
            >
              Logout
            </button>
          </>
        )}
      </aside>

      {/* Sidebar Toggle Button */}
      {!sidebarVisible && (
        <button
          onClick={() => setSidebarVisible(true)}
          className="fixed top-4 left-4 text-white rounded-full p-2 transition"
        >
          <CgMenuLeft className="text-2xl" />
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6">
        {/* Messages Section */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start ${
                msg.type === "question" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar for AI Response */}
              {msg.type === "response" && (
                <div className="flex-shrink-0 mr-2">
                  <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-black font-bold">
                    AI
                  </div>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  msg.type === "question"
                    ? "bg-gray-700 text-white mr-4 "
                    : " text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing Animation */}
          {typingMessage && (
            <div className="flex items-start justify-start">
              <div className="flex-shrink-0 mr-2">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-black font-bold">
                  AI
                </div>
              </div>
              <div className="p-3 rounded-lg max-w-xs  text-white">
                {typingMessage}
              </div>
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div className="flex space-x-2">
          <input
            type="text"
            ref={inputRef}
            placeholder="Message ChatBot"
            className="w-[95%] p-2 bg-gray-800 rounded text-white placeholder-gray-400 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            onClick={handleSend}
            className="h-8 w-8 bg-white rounded-full text-black flex items-center justify-center transition hover:bg-gray-200"
          >
            <IoIosSend className="text-2xl" />
          </button>
        </div>
      </main>
    </div>
  );
}
