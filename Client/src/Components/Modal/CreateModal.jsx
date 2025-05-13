import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPersonalMeeting } from '../../utils/api';

const CreateModal = ({ onClose, setActiveModal }) => {
  const navigate = useNavigate();

  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleParticipants, setScheduleParticipants] = useState('');
  const [password, setPassword] = useState('');
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

      const response = await createPersonalMeeting(
        scheduleTitle,
        scheduleDate,
        password,
        participantsArray,
      );

      if (response.meeting) {
        setSuccess('Meeting scheduled successfully!');
        setTimeout(() => {
          setSuccess('');
          setActiveModal?.(null); // optional chaining in case setActiveModal is not passed
          onClose?.();
          setScheduleTitle('');
          setScheduleDate('');
          setScheduleParticipants('');
          setPassword('');
        }, 1000);
      } else {
        setError(response.message || 'Failed to schedule meeting');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="bg-[#1C1F2E] text-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-full relative flex flex-col items-center">
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Meeting</h2>

        <form className="space-y-4 w-full" onSubmit={handleScheduleMeeting}>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

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

          <input
            type="text"
            placeholder="Participants (comma-separated emails)"
            value={scheduleParticipants}
            onChange={(e) => setScheduleParticipants(e.target.value)}
            className="w-full bg-[#2E3450] text-white placeholder-gray-400 px-4 py-2 rounded-md"
          />

          <input
            type="password"
            placeholder="Meeting Password (optional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#2E3450] text-white placeholder-gray-400 px-4 py-2 rounded-md"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md w-full font-semibold"
          >
            Create Meeting
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
