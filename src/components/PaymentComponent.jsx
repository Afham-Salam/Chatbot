import axios from "axios";
import React from "react";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

const PaymentComponent = () => {
  const { error, isLoading, Razorpay } = useRazorpay();

  const handlePayment = async () => {

    console.log("Purchase button clicked");
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication token not found. Please log in.");
      return;
    }

    // Fetch the Razorpay order details from the backend using axios
    const response = await axios.post(
      `http://45.159.221.50:9093/auth/purchase/676264043f05b1fbd48aca30`,
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
      }
    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <div>
      <h1>Payment Page</h1>
      {isLoading && <p>Loading Razorpay...</p>}
      {error && <p>Error loading Razorpay: {error}</p>}
      <button onClick={ handlePayment} disabled={isLoading}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentComponent;