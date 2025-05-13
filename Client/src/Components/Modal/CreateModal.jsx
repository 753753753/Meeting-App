import React from "react";

const CreateModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="bg-[#1C1F2E] p-6 rounded-lg w-[350px] relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl hover:text-gray-400"
        >
          &times;
        </button>

        <h2 className="text-white text-lg font-semibold mb-4">Create Meeting</h2>

        <div className="mb-4">
          <label className="block text-sm text-white mb-1">Add a description</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-[#252A41] text-white rounded focus:outline-none"
            placeholder="e.g. Team Sync"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-white mb-1">Select Date & Time</label>
          <input
            type="datetime-local"
            className="w-full px-4 py-2 bg-[#252A41] text-white rounded focus:outline-none"
          />
        </div>

        <button
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2 rounded"
        >
          Create Meeting
        </button>
      </div>
    </div>
  );
};

export default CreateModal;
