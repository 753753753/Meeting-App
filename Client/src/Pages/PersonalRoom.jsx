import React, { useState } from 'react';
import CreateModal from '../Components/Modal/CreateModal';

function PersonalRoom() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex-1 bg-gray-950 min-h-screen p-4 sm:p-6 md:p-10">
      <div className="bg-[#1C1F2E] p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-white text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
          Personal Meeting Room
        </h2>

        {/* Info Section */}
        <div className="space-y-4 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="w-32 font-medium text-gray-300">Topic:</span>
            <span className="font-semibold mt-1 sm:mt-0">
              JS Mastery’s Personal Meeting Room
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="w-32 font-medium text-gray-300">Meeting ID:</span>
            <span className="font-semibold mt-1 sm:mt-0">324 531 3821</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="w-32 font-medium text-gray-300">Passcode:</span>
            <div className="flex items-center mt-1 sm:mt-0">
              <span className="font-semibold">********</span>
              <button className="ml-2 text-blue-400 text-sm hover:underline">
                Show
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start">
            <span className="w-32 font-medium text-gray-300 mt-1">Invite Link:</span>
            <a
              href="#"
              className="text-blue-400 break-words hover:underline mt-1 sm:mt-0"
            >
              https://us93web.qoom.us/345672??pwd=3f2uiui3h4un134if
            </a>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full sm:w-auto cursor-pointer">
            Start the meeting
          </button>
          <button className="bg-[#252A41] hover:bg-[#2E334E] text-white px-4 py-2 rounded text-sm w-full sm:w-auto cursor-pointer">
            Copy Invitation
          </button>
          <button className="bg-[#252A41] hover:bg-[#2E334E] text-white px-4 py-2 rounded text-sm w-full sm:w-auto cursor-pointer">
            Edit
          </button>
          <button className="bg-[#252A41] hover:bg-[#2E334E] text-white px-4 py-2 rounded text-sm w-full sm:w-auto cursor-pointer">
            Delete
          </button>
        </div>
      </div>

      {/* Create Room Button */}
      <div className="bg-[#1C1F2E] p-4 rounded-lg shadow-md mt-5">
        <button
          className="bg-[#252A41] hover:bg-[#2E334E] text-white text-sm px-4 py-2 rounded w-full flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <span className="text-lg">+</span> Create a new room
        </button>
      </div>

      {/* Modal */}
      {showModal && <CreateModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default PersonalRoom;
