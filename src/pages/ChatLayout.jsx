import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoIosSend, IoIosClose } from "react-icons/io";
import { CgMenuLeft } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown"; // Import react-markdown
import ClearHistory from "../components/ClearHistory";
import Logout from "../components/Logout";

export default function ChatLayout() {
  const [messages, setMessages] = useState([]); // Chat history
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [typingMessage, setTypingMessage] = useState(""); // Typing animation state
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch initial chat history
  const fetchInitialData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("http://45.159.221.50:9093/chatbot/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assuming the response data is an array of objects with userMessage and botResponse
      if (res.data) {
        setMessages(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Handle sending a new message
  const handleSend = async () => {
    const userMessage = inputRef.current.value;

    if (!userMessage.trim()) return;

    const query = { message: userMessage };
    const token = localStorage.getItem("token");

    try {
      // Add user message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { userMessage: userMessage, botResponse: null },
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

  // Typing animation for bot response
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
          ...prevMessages.slice(0, -1), // Remove the placeholder
          {
            userMessage: prevMessages[prevMessages.length - 1].userMessage,
            botResponse: text,
          },
        ]);
        setTypingMessage("");
      }
    }, 10); // Adjust typing speed here
  };

  //Function to clear chat history
  const clearHistory = async () => {
    const token = localStorage.getItem("token"); // Retrieve token

    if (!token) {
      console.error("No token found, user must log in.");
      navigate("/login");
      return;
    }

    try {
      // Send DELETE request to clear chat history
      await axios.delete("http://45.159.221.50:9093/chatbot/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear chat messages in state
      setMessages([]);
      console.log("Chat history cleared successfully.");
    } catch (error) {
      console.error("Failed to clear chat history:", error);
    }
  };

  // Logout function
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
            ? "w-72  border-r border-gray-500 sm:relative absolute "
            : "w-0 sm:w-0 sm:relative"
        } h-screen   md:p-4 p-2 transition-all duration-300 bg-black z-40`}
      >
        {sidebarVisible && (
          <>
            <div className="flex justify-between items-center">
              <div className="text-gray-300 font-bold text-lg mb-4">
                ChatBot
              </div>
              <button
                onClick={() => setSidebarVisible(false)}
                className="text-white text-xl"
              >
                <IoIosClose />
              </button>
            </div>
            <ClearHistory clear={clearHistory} />
            <Logout click={logout} />
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
      <main className="flex-1 flex flex-col md:p-6">
        {/* Messages Section */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
          {messages.map((msg, index) => (
            <React.Fragment key={index}>
              {/* User Message */}
              {msg.userMessage && (
                <div className="flex justify-end items-start">
                  <div className="p-3 rounded-lg bg-gray-700 text-white max-w-[80%] mt-12 md:mr-14 mr-3">
                    <ReactMarkdown>{msg.userMessage}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Bot Response */}
              {msg.botResponse && (
                <div className="flex justify-start items-start">
                  <div className="flex-shrink-0 mr-2">
                    <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-black font-bold">
                      AI
                    </div>
                  </div>
                  <div className="p-3 rounded-lg  text-white max-w-[80%]">
                    <ReactMarkdown>{msg.botResponse}</ReactMarkdown>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Typing Animation */}
          {typingMessage && (
            <div className="flex items-start justify-start">
              <div className="flex-shrink-0 mr-2">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-black font-bold">
                  AI
                </div>
              </div>
              <div className="p-3 rounded-lg  text-white max-w-[80%]">
                <ReactMarkdown>{typingMessage}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div className="flex space-x-2 items-center  p-3 ">
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
            className="h-8 w-8  bg-white rounded-full text-black flex items-center justify-center transition hover:bg-gray-200"
          >
            <IoIosSend className="text-2xl" />
          </button>
        </div>
      </main>
    </div>
  );
}
