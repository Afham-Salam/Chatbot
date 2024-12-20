 import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import APIClientPrivate from "../utils/axios";

export default function Login() {
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = {
      email: values.email.trim(),
      password: values.password.trim(),
      // walletBalance:10
    };

    try {
      const response = await APIClientPrivate.post(
        "/auth/login",
        formData
      );

      console.log({response},response.data.subscription);
      
      setMessage(response.data.message);
      
      if (response.data.refreshToken) {
        localStorage.setItem("token", response.data.accessToken);
        const payload = JSON.parse(
          atob(response.data.accessToken.split(".")[1])
        );
        console.log("user",response.data.walletBalance)
        localStorage.setItem("userId", payload.id);
         localStorage.setItem("walletBalance", response.data.walletBalance);

         if(response.data.subscription.planId){
          localStorage.setItem("subscription", JSON.stringify(response.data.subscription));
         }


        if (payload.id) {
          navigate("/home");
        } else {
          navigate("/login");
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className=" flex flex-col bg-black bg pt-1">
        <div className="w-full    text-white flex justify-between px-6 py-1">
          <p>Logo</p>
          <Link
            to={"/signup"}
            className="bg-white text-black  hover:opacity-80 px-3 py-1 rounded-md font-semibold"
          >
            Signup
          </Link>
        </div>

        <div className="w-full h-screen flex lg:flex-row flex-col lg:gap-40 items-center ">
          {/* Left Section */}
          <div className="lg:h-screen h-36 w-1/2 flex flex-col items-center gap-2 justify-center text-white">
            <h1 className="lg:text-[75px] font-extrabold fontStyle tracking-wider lg:block hidden">
              Welcome Back!
            </h1>
            <p className="text-lg text-center max-w-[80%]  tracking-wide lg:block hidden fontStyle">
              Elevate your marketing with our smart chatbot
            </p>
            <p className="md:text-[2rem] font-extrabold tracking-wide text-[22px] ">
              Log in now!
            </p>
          </div>

          {/* Right Section */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="md:p-10 p-7 border-2  rounded-lg border-gray-300 shadow-lg">
                {/* Email Input */}
                <div className="lg:mb-5 mb-3">
                  <label className="block text-sm text-white text-opacity-80 mb-2">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="md:w-[22rem] w-full px-4 py-2 bg-black border-2 text-white border-opacity-45 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-white transition duration-200 ease-in-out"
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-[12px] lg:mt-2 "
                  />
                </div>

                {/* Password Input */}
                <div className="lg:mb-5 mb-3 relative">
                  <label className="block text-sm text-white text-opacity-80 mb-2">
                    Password
                  </label>
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="md:w-[22rem] w-full px-4 py-2 bg-black border-2 text-white border-opacity-45 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-white transition duration-200 ease-in-out"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute top-11 right-4 flex items-center text-[20px] text-white text-opacity-80"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-[12px] lg:mt-2"
                  />
                </div>

                {/* Forgot Password */}
                <div className="text-right mb-2">
                  <Link
                    to="/forgot-password"
                    className="text-white text-opacity-80 text-[13px] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  className="w-full lg:py-3 py-2 bg-white hover:bg-transparent hover:text-white border-2 border-white text-black text-md font-semibold rounded-md hover:bg-blue-600 transition duration-200 ease-in-out"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>

                <div className="flex items-center my-2">
                  <hr className="flex-1 border-gray-300" />
                  <span className="mx-4 text-white">or</span>
                  <hr className="flex-1 border-gray-300" />
                </div>

                {/* Google Login Button */}
                <button
                  className="w-full lg:py-3 py-2 bg-white border-2 border-gray-300 text-md font-semibold rounded-md flex items-center justify-center space-x-3 hover:bg-gray-300 transition duration-200 ease-in-out"
                  type="button"
                >
                  <img
                    src="/google.webp"
                    alt="Google Logo"
                    className="w-6 h-6"
                  />
                  <span className="text-gray-800">Login with Google</span>
                </button>

                {/* Signup Link */}
                <p className="text-center text-white text-opacity-80 text-sm mt-3">
                  Don't have an account?{" "}
                  <Link to="/signup" className="hover:underline">
                    Signup
                  </Link>
                </p>

                {/* Error/Success Message */}
                {message && (
                  <p
                    className={`text-center mt-4 ${
                      message.toLowerCase().includes("failed")
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
