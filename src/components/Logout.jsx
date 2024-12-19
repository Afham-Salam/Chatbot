import React from "react";

export default function Logout({ click }) {
  return (
    <>
      {/* Logout Button */}
      <button
        className="mt-5 w-full text-center bg-gray-800 py-2 text-white rounded hover:scale-105  hover:bg-gray-700 transition"
        onClick={() => document.getElementById("my_modal_2").showModal()}
      >
        Logout
      </button>

      {/* Modal */}
      <dialog
        id="my_modal_2"
        className="modal"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
      >
        <div className="modal-box">
          <h3 id="modal-title" className="font-bold text-lg">Logout</h3>
          <p id="modal-desc" className="py-4">
            Are you sure you want to log out? This action will end your current session.
          </p>

          <div className="modal-action">
            {/* Confirm Logout Button */}
            <button
              onClick={() => {
                click(); // Trigger the logout logic
                document.getElementById("my_modal_2").close(); // Close the modal
              }}
              className="bg-green-700 text-sm font-semibold text-white px-4  rounded-lg hover:bg-green-900"
            >
              Logout
            </button>

            {/* Cancel Button */}
            <button
              className="bg-gray-700 px-2 text-sm font-semibold rounded-lg py-3 hover:bg-gray-900"
              onClick={() => document.getElementById("my_modal_2").close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
