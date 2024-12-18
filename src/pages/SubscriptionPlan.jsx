import axios from "axios";
import React, { useEffect, useState } from "react";

export default function SubscriptionPlan() {

  const [plan,setPlan]=useState([])


  const fetchPlan = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://45.159.221.50:9093/api/plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setPlan(res.data); 
      
      console.log(res.data);
      
     
    } catch (error) {
      console.error("Failed to fetch hint questions:", error);
    }
  };
  
  useEffect(() => {
    fetchPlan()
  }, []);



  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10">
      <h1 className="text-4xl font-extrabold mb-4 text-center">Choose Your Chatbot Plan</h1>
      <p className="text-gray-400 mb-6 text-center">
        Automate your digital marketing with a powerful chatbot designed to
        engage customers and grow your business.
      </p>

      {/* Toggle Button for Monthly/Yearly */}
    

      {/* Subscription Plans */}
      <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl px-6">
        {plan.map((it) => (
          <div
            key={it.id}
            className="bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">{it.name}</h2>
              <p className="text-gray-400 mb-4">{it.description}</p>
              <p className="text-3xl font-extrabold mb-4">
                &#8377;&nbsp;
                {it.price}
                /-
              </p>
            </div>
            
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-md font-semibold transition duration-300">
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
