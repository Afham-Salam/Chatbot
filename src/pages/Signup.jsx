import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Signup() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    const { email, password } = values;
    const formData = {
      email,
      password,
      role: "student",
      walletBalance:8
      
    };
    console.log(formData);

    try {
      const response = await axios.post(
        "http://45.159.221.50:9093/auth/signup",
        formData
      );
      setMessage(response.data.message);
      console.log("user",response.data.message)
      localStorage.setItem("token", response.data.refreshToken);
      localStorage.setItem("walletBalance", response.data.walletBalance);
      navigate("/login");
    } catch (error) {
      setMessage(
        error.response ? error.response.data.message : "Registration failed"
      );
    }
  };

  return (
    <>
      <div className=" flex flex-col bg-black bg pt-1">
        <div className="w-full    text-white flex justify-between px-6 py-1">
          <p>Logo</p>
          <Link
            to={"/login"}
            className="bg-white text-black  hover:opacity-80 px-3 py-1 rounded-md font-semibold"
          >
            Login
          </Link>
        </div>

        <div className="w-full h-screen  flex lg:flex-row flex-col lg:gap-36 items-center ">
          {/* Left Section */}

          <div className="lg:h-screen h-36 w-1/2 flex flex-col items-center gap-2 justify-center text-white">
            <h1 className="lg:text-[5rem] font-extrabold fontStyle tracking-wider lg:block hidden">
              Welcome!
            </h1>
            <p className="text-lg text-center max-w-[80%]  tracking-wide lg:block hidden fontStyle">
              Supercharge your marketing with our chatbot
            </p>
            <p className="md:text-[2rem] font-extrabold tracking-wide text-[22px] ">
              Sign up now!
            </p>
          </div>

          {/* Right Section */}
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form className="md:p-10 p-7 border-2 rounded-lg border-gray-300 shadow-lg">
                {/* Email Input */}
                <div className="lg:mb-3 mb-2">
                  <label className="block text-sm text-white text-opacity-80 mb-2">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="md:w-[22rem] w-full px-4 py-2 bg-black border-2 text-white border-opacity-45 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition duration-200 ease-in-out"
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-[12px] lg:mt-2"
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
                    className="text-red-500 text-[12px] lg:mt-2 "
                  />
                </div>

                {/* Submit Button */}
                <button
                  className="w-full lg:py-3 py-2 bg-white hover:bg-transparent hover:text-white border-2 border-white text-black text-md font-semibold rounded-md hover:bg-blue-600 transition duration-200 ease-in-out"
                  type="submit"
                >
                  Signup
                </button>

                <div className="flex items-center my-2">
                  <hr className="flex-1 border-gray-300" />
                  <span className="mx-4 text-white">or</span>
                  <hr className="flex-1 border-gray-300" />
                </div>

                {/* Google Signup Button */}
                <button
                  className="w-full lg:py-3 py-2 bg-white border-2 border-gray-300 text-md font-semibold rounded-md flex items-center justify-center space-x-3 hover:bg-gray-300 transition duration-200 ease-in-out"
                  type="button"
                >
                  <img
                    src="/google.webp"
                    alt="Google Logo"
                    className="w-6 h-6"
                  />
                  <span className="text-gray-800">Sign up with Google</span>
                </button>

                {/* Login Link */}
                <p className="text-center text-white text-opacity-80 text-sm mt-3">
                  Already have an account?{" "}
                  <Link to="/login" className="hover:underline text-b">
                    Login
                  </Link>
                </p>

                {/* Error/Success Message */}
                {message && (
                  <p
                    className={`text-center mt-4 ${
                      message.includes("failed")
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
