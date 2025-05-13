import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateModal from '../Components/Modal/CreateModal';
import PasswordModal from '../Components/Modal/PasswordModal';
import { useUser } from '../context/UserContext'; // adjust path as needed
import { deletePersonalMeeting, getPersonalMeetings } from '../utils/api';
function PersonalRoom() {
  const [showModal, setShowModal] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const navigate = useNavigate();
  const { role } = useUser(); // Destructure role from context
  const [passwordModal, setPasswordModal] = useState({
    show: false,
    meeting: null,
    input: '',
    error: ''
  });
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await getPersonalMeetings();
        setMeetings(response.meetings);
      } catch (error) {
        console.error('Failed to fetch meetings:', error);
      }
    };

    fetchMeetings();
  }, []);

  const handleDelete = async (meetingId) => {
    try {
      await deletePersonalMeeting(meetingId);
      setMeetings(prevMeetings => prevMeetings.filter(meeting => meeting._id !== meetingId));
    } catch (error) {
      console.error('Failed to delete meeting:', error);
    }
  };

  const handleCopyInvitation = (roomid) => {
    const inviteURL = `${window.location.origin}/room/${roomid}`;
    navigator.clipboard.writeText(inviteURL)
      .then(() => alert("Invitation link copied to clipboard!"))
      .catch((err) => console.error('Failed to copy:', err));
  };

  return (
    <div className="flex-1 bg-gray-950 min-h-screen p-4 sm:p-6 md:p-10">
      {meetings.length === 0 ? (
        <div className="flex justify-center items-center h-96 text-center">
          <div className="bg-[#1C1F2E] p-6 rounded-lg shadow-xl text-white">
            <h4 className="text-xl font-semibold mb-4">No Meetings Found</h4>
            <p className="text-gray-400">Looks like you don't have any upcoming meetings. Please schedule one!</p>
          </div>
        </div>
      ) : (
        meetings.map((meeting) => (
          <div
            key={meeting._id}
            className="bg-[#1C1F2E] p-4 sm:p-6 rounded-lg shadow-md mb-6"
          >
            <h2 className="text-white text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Personal Meeting Room
            </h2>

            <div className="space-y-4 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="w-32 font-medium text-gray-300">Topic:</span>
                <span className="font-semibold mt-1 sm:mt-0">{meeting.title}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="w-32 font-medium text-gray-300">Meeting ID:</span>
                <span className="font-semibold mt-1 sm:mt-0">{meeting._id.slice(-10)}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="w-32 font-medium text-gray-300">Passcode:</span>
                <div className="flex items-center mt-1 sm:mt-0">
                  {showPassword ? (
                    <span className="font-semibold">{meeting.password}</span>
                  ) : (
                    <span className="font-semibold">****</span>
                  )}
                  {role === 'admin' && (
                    <button
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="ml-2 text-blue-400 hover:underline"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start">
                <span className="w-32 font-medium text-gray-300 mt-1">Invite Link:</span>
                <a
                  href={`${window.location.origin}/room/${meeting._id}`}
                  className="text-blue-400 break-words hover:underline mt-1 sm:mt-0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${window.location.origin}/room/${meeting._id}`}
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full sm:w-auto cursor-pointer" onClick={() =>
                setPasswordModal({ show: true, meeting, input: '', error: '' })
              }>
                Start the meeting
              </button>
              <button
                className="bg-[#252A41] hover:bg-[#2E334E] text-white px-4 py-2 rounded text-sm w-full sm:w-auto cursor-pointer"
                onClick={() => handleCopyInvitation(meeting._id)}
              >
                Copy Invitation
              </button>
              <button
                className="bg-[#252A41] hover:bg-[#2E334E] text-white px-4 py-2 rounded text-sm w-full sm:w-auto cursor-pointer"
                onClick={() => handleDelete(meeting._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      <div className="bg-[#1C1F2E] p-4 rounded-lg shadow-md mt-5">
        <button
          className="bg-[#252A41] hover:bg-[#2E334E] text-white text-sm px-4 py-2 rounded w-full flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <span className="text-lg">+</span> Create a new room
        </button>
      </div>

      {showModal && <CreateModal onClose={() => setShowModal(false)} />}
      <PasswordModal
        visible={passwordModal.show}
        meeting={passwordModal.meeting}
        input={passwordModal.input}
        error={passwordModal.error}
        onCancel={() =>
          setPasswordModal({ show: false, meeting: null, input: '', error: '' })
        }
        onChange={(e) =>
          setPasswordModal({ ...passwordModal, input: e.target.value, error: '' })
        }
        onSubmit={() => {
          if (passwordModal.input === passwordModal.meeting?.password) {
            navigate(`/room/${passwordModal.meeting._id}`);
          } else {
            setPasswordModal(prev => ({ ...prev, error: 'Incorrect password' }));
          }
        }}
      />
    </div>
  );
}

export default PersonalRoom;
