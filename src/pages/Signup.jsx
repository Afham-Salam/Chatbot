import axios from "axios";
import React, { useRef, useState } from "react";


export default function Signup() {
  const [message, setMessage] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValue = emailRef.current.value;
    const passwordValue = passwordRef.current.value;

    // Validate email and password
    if (!emailValue || !passwordValue) {
      setMessage("Email and Password are required.");
      return;
    }

    try {
      // API call to signup
      const response = await axios.post("http://45.159.221.50:9093/auth/signup", {
        email: emailValue,
        password: passwordValue,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response ? error.response.data.message : "Registration failed"
      );
    }
  };

  return (
    <div className="w-full h-screen flex flex-col gap-3 justify-center items-center">
      <h1 className="text-2xl">Register</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          ref={emailRef}
          className="border-2 p-2"
          placeholder="Email"
          required
        />
        <label>Password</label>
        <input
          type="password"
          ref={passwordRef}
          className="border-2 p-2"
          placeholder="Password"
          required
        />
        <button className="bg-blue-500 text-white py-3" type="submit">
          Signup
        </button>
        {/* Error/Success Message */}
        {message && (
          <p className={`text-center mt-4 ${message.includes("failed") ? "text-red-500" : "text-green-500"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
