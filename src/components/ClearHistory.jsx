import React from "react";

export default function ClearHistory({ clear }) {
  return (
    <>
      {/* Open the modal using document.getElementById('my_modal_1').showModal() method */}
      <button
        className=" mt-5 w-full text-center bg-gray-800 py-2 hover:scale-105 rounded hover:bg-gray-700 transition"
        onClick={() => document.getElementById('my_modal_1').showModal()}
      >
       Clear History
      </button>

      <dialog id="my_modal_1" className="modal ">
        <div className="modal-box r">
          <h3 className="font-bold text-lg">Clear History</h3>
          <p className="py-4">
            Are you sure you want to clear your history.
          </p>

          <div className="modal-action">
            {/* Clear History Button */}
            <button
              onClick={() => {
                clear(); // Trigger clear history logic
                document.getElementById('my_modal_1').close(); // Close the modal
              }}
              className="bg-red-700 text-sm font-semibold text-white px-4  rounded-lg hover:bg-red-900"
            >
              Delete
            </button>

            {/* Close Modal Button */}
            <button
              className=" bg-gray-700 px-2 text-sm font-semibold rounded-lg py-3 hover:bg-gray-900"
              onClick={() => document.getElementById('my_modal_1').close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
