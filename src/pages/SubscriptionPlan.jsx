import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import PaymentComponent from "../components/PaymentComponent";


export default function SubscriptionPlan() {
  const { error, isLoading, Razorpay } = useRazorpay();

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

  
const handlePurchase = async (id) => {
  try {
    console.log("Purchase button clicked");
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication token not found. Please log in.");
      return;
    }

    // Fetch the Razorpay order details from the backend using axios
    const response = await axios.post(
      `http://45.159.221.50:9093/auth/purchase/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }, // This should be in the 3rd parameter
      }
    );
    

    console.log("Response data:", response.data);

    const data = response.data;

    // Validate response data
    if (!data.orderId) {
      console.error("Order ID not found in the response");
      alert("Failed to create order. Please try again.");
      return;
    }

    // Initialize Razorpay Checkout
    const options = {
      key: "rzp_live_0xAoU4Lze8zFe9", // Replace with your Razorpay Key ID
      amount: data.amount * 100, // Amount in paise
      currency: data.currency,
      name: "Your App Name",
      description: `Purchase ${data.plan.name}`,
      order_id: data.orderId, // Razorpay Order ID
      handler: async (response) => {
        console.log("Payment successful:", response);
        alert("Payment successful:");

        // Verify payment with the backend
        const verifyResponse = await axios.post(
          "http://45.159.221.50:9093/auth/verify-payment",
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            planId: id, // Pass the dynamic plan ID
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Verify response data:", verifyResponse.data);

        if (verifyResponse.status === 200 && verifyResponse.data.message) {
          alert("Payment verified successfully." , verifyResponse.data.message);
        } else {
          console.error("Failed to verify payment:", verifyResponse.data);
          alert("Failed to verify payment. Please contact support.");
        }
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
    };

    console.log("Opening Razorpay Checkout...");
    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
   
  } catch (error) {
    console.error("Error during purchase:", error.response || error.message);
    alert("An error occurred. Please try again later.");
  }
};

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10">
   
  
    <h1 className="text-4xl font-extrabold mb-4 text-center">
      Choose Your Chatbot Plan
    </h1>
    <p className="text-gray-400 mb-6 text-center">
      Automate your digital marketing with a powerful chatbot designed to
      engage customers and grow your business.
    </p>

      {/* Toggle Button for Monthly/Yearly */}
    

      {/* Subscription Plans */}
      <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl px-6">
        {plan.map((it,index) => (
          <div
            key={index}
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
            
            <button onClick={()=>handlePurchase(it._id)} className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-md font-semibold transition duration-300">
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
