import React, { useEffect, useState } from "react";
import { Drawer, Button } from "antd";
import axios from "axios";
import { GrMail } from "react-icons/gr";


const Profile = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [letter, setLetter] = useState("");
  const [error, setError] = useState(null); // Error handling

  const showDrawer = () => {
    setOpen(true);
    setLoading(true);

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://45.159.221.50:9093/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfileData(response.data);
        
        
        setLetter(response.data.email);
      
        localStorage.setItem("letter", response.data.email);
      } catch (err) {
        setError("Failed to fetch profile data. Please try again.");
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      {/* My Profile Button */}
      <div  onClick={showDrawer} className="absolute top-3 right-3 h-8 w-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transform transition-transform duration-300">
    {letter.charAt(0).toUpperCase()}
  </div>

      {/* Ant Design Drawer */}
      <Drawer
        title="My Profile"
        placement="right"
        closable
        width={300}
        destroyOnClose
        onClose={closeDrawer}
        open={open}
        drawerStyle={{
          backgroundColor: "black",
          color: "white",
          borderLeft: "2px solid #6b7280", // Add left-side border
        }}
        headerStyle={{
          backgroundColor: "black",
          color: "white",
        }}
        closeIcon={<span style={{ color: "white" }}>×</span>} // Custom close icon color
      >
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          profileData && (
            <>
              <div className="w-20 h-20 rounded-full bg-green-600 mx-auto mb-6 flex justify-center items-center">
                <p className="text-[42px] font-bold text-white">
                  {letter.charAt(0).toUpperCase()}
                </p>
              </div>

              <div className=" text-white text-center space-y-4">
                
                <p className="text-md font-semibold">
                  <span className="block text-white">
                    Remaining Limit&nbsp;
                    <span className="text-black font-extrsbold bg-slate-50 px-3">
                      {profileData.walletBalance}
                    </span>
                  </span>
                 
                </p>
                <p className="text-md   font-semibold">
                
                  <span className="block text-white">
                  {profileData.email}
                  </span>
                </p>
                <hr className="opacity-60"></hr>
                
               { console.log(profileData.subscription.name)}
                
                <p className="text-left text-[16px]">Selected Plan</p>
                <p className="text-gray-300 text-left">{profileData.subscription.name}</p>
                <p className="text-gray-300 text-left">{profileData.subscription.expiresAt}</p>
                <button
                  className="mt-5 w-full text-center bg-gray-800 py-2 text-white rounded hover:scale-105  hover:bg-gray-700 transition"
                  onClick={() =>
                    document.getElementById("my_modal_2").showModal()
                  }
                >
                  Logout
                </button>
              </div>
            </>
          )
        )}
      </Drawer>
    </>
  );
};

export default Profile;