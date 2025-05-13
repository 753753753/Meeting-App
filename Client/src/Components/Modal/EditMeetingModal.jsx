import React from "react";

const EditMeetingModal = ({ isOpen, meeting, setMeeting, onClose, onSave }) => {
  if (!isOpen || !meeting) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="bg-[#1C1F2E] p-6 rounded-lg w-[350px] relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl hover:text-gray-400"
        >
          &times;
        </button>

        <h2 className="text-white text-lg font-semibold mb-4">Edit Meeting</h2>

        <div className="mb-4">
          <input
            type="text"
            className="w-full px-4 py-2 bg-[#252A41] text-white rounded focus:outline-none"
            value={meeting.title}
            onChange={(e) => setMeeting({ ...meeting, title: e.target.value })}
            placeholder="e.g. Team Sync"
          />
        </div>

        <div className="mb-6">
          <input
            type="datetime-local"
            className="w-full px-4 py-2 bg-[#252A41] text-white rounded focus:outline-none"
            value={new Date(meeting.date).toISOString().slice(0, 16)}
            onChange={(e) => setMeeting({ ...meeting, date: e.target.value })}
          />
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="w-1/2 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="w-1/2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMeetingModal;
