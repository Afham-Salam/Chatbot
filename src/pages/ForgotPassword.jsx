import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function ForgotPassword() {
  const [message, setMessage] = useState("");

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = { email: values.email.trim() };

    try {
      const response = await axios.post(
        "http://45.159.221.50:9093/auth/forgot-password",
        formData
      );
      setMessage(response.data.message || "Password reset link sent!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send reset link.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex h-screen flex-col bg-black bg pt-1">
        {/* Header Section */}
        <div className="w-full text-white flex justify-between px-6 py-1">
          <p>Logo</p>
          <Link
            to="/login"
            className="bg-white text-black hover:opacity-80 px-3 py-1 rounded-md font-semibold"
          >
            Login
          </Link>
        </div>

        {/* Main Content */}
        <div className="w-full h-screen flex flex-col items-center justify-center">
          {/* Left Section */}
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl font-extrabold tracking-wider mb-3">
              Forgot Password?
            </h1>
            <p className="text-md tracking-wide ">
              Enter your email to receive a password reset link.
            </p>
          </div>

          {/* Form Section */}
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="md:p-20 p-7 border-2 rounded-lg border-gray-300 shadow-lg bg-black">
                {/* Email Input */}
                <div className="mb-5">
                  <label className="block text-sm text-white text-opacity-80 mb-2">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="md:w-[20rem] px-4 py-2 bg-black border-2 text-white border-opacity-45 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-white transition duration-200 ease-in-out"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-[12px] mt-2"
                  />
                </div>

                {/* Submit Button */}
                <button
                  className="w-full py-2 bg-white hover:bg-transparent hover:text-white border-2 border-white text-black text-md font-semibold rounded-md hover:bg-blue-600 transition duration-200 ease-in-out"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>

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
