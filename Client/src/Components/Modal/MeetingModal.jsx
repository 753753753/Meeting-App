import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMeeting, getMeetings } from '../../utils/api'; // Adjust path if needed

export default function MeetingModal({ activeModal, setActiveModal }) {
  if (!activeModal) return null;

  const navigate = useNavigate();
  const [joinInput, setJoinInput] = useState('');

  const getTitle = () => {
    switch (activeModal) {
      case 'new':
        return 'Start a New Meeting';
      case 'join':
        return 'Join a Meeting';
      case 'schedule':
        return 'Schedule a Meeting';
      default:
        return '';
    }
  };

  const extractRoomId = (input) => {
    try {
      const url = new URL(input);
      const parts = url.pathname.split('/');
      return parts.includes('room') ? parts.pop() : input;
    } catch {
      return input; // assume it's a room ID
    }
  };

  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleParticipants, setScheduleParticipants] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();

    if (!scheduleTitle || !scheduleDate) {
      setError('Title and Date are required');
      return;
    }

    try {
      const participantsArray = scheduleParticipants
        ? scheduleParticipants.split(',').map((p) => p.trim())
        : [];
      console.log(scheduleDate, scheduleParticipants, scheduleTitle)
      const response = await createMeeting(scheduleTitle, scheduleDate, participantsArray);
      if (response.meeting) {
        setSuccess('Meeting scheduled successfully!');
        setTimeout(() => {
          setSuccess('');
          setActiveModal(null); // close modal
          setScheduleTitle('');
          setScheduleDate('');
          setScheduleParticipants('');
        }, 1000);
      } else {
        setError(response.message || 'Failed to schedule meeting');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="bg-[#1C1F2E] text-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-full relative flex flex-col items-center">
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl"
          onClick={() => setActiveModal(null)}
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6 text-center">{getTitle()}</h2>

        {/* New Meeting */}
        {activeModal === 'new' && (
          <div className="space-y-4 text-center">
            <button
              className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md w-full font-semibold"
              onClick={() => {
                setActiveModal(null);
                navigate(`/room/${Date.now()}`);
              }}
            >
              Start Now
            </button>
          </div>
        )}

        {/* Join Meeting */}
        {activeModal === 'join' && (
          <div className="space-y-4 text-center">
            <input
              type="text"
              placeholder="Enter meeting link or code"
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value)}
              className="w-full bg-[#2E3450] text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md w-full font-semibold"
              onClick={() => {
                const roomId = extractRoomId(joinInput.trim());
                if (roomId) {
                  setActiveModal(null);
                  navigate(`/room/${roomId}`);
                }
              }}
            >
              Join Meeting
            </button>
          </div>
        )}

        {/* Schedule Meeting */}
        {activeModal === 'schedule' && (
          <form className="space-y-4 text-center" onSubmit={handleScheduleMeeting}>
            {error && <p className="text-red-400">{error}</p>}
            {success && <p className="text-green-400">{success}</p>}

            <input
              type="text"
              placeholder="Meeting Title"
              value={scheduleTitle}
              onChange={(e) => setScheduleTitle(e.target.value)}
              className="w-full bg-[#2E3450] text-white placeholder-gray-400 px-4 py-2 rounded-md"
            />
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full bg-[#2E3450] text-white px-4 py-2 rounded-md"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md w-full font-semibold"
            >
              Schedule Meeting
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
