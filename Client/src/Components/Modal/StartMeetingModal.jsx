import React from 'react';
import { useUser } from '../../context/UserContext'; // adjust path if needed

const StartMeetingModal = ({ isOpen, onClose, onStartWithRecording, onStartWithoutRecording }) => {
  const { role } = useUser(); // Get role from context

  if (!isOpen) return null;

  const isAdmin = role === 'admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="bg-[#1C1F2E] p-6 rounded-lg w-[350px] relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl hover:text-gray-400"
        >
          &times;
        </button>

        <h2 className="text-white text-lg font-semibold mb-4">Start Meeting</h2>
        <p className="text-gray-300 mb-6">
          {isAdmin
            ? 'Choose how you want to start the meeting:'
            : 'Click below to start the meeting.'}
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={onStartWithoutRecording}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded cursor-pointer"
          >
            Start Normally
          </button>

          {isAdmin && (
            <button
              onClick={onStartWithRecording}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded cursor-pointer"
            >
              Start with Recording
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartMeetingModal;
