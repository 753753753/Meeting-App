import { useContext, useEffect, useState } from 'react';
import { FaEdit, FaRegCalendarAlt, FaTrashAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import user2 from '../assets/avatar (1).png';
import user3 from '../assets/avatar (2).png';
import user4 from '../assets/avatar (3).png';
import user1 from '../assets/avatar.png';
import EditMeetingModal from '../Components/Modal/EditMeetingModal';
import StartMeetingModal from '../Components/Modal/StartMeetingModal';
import { SpeechContext } from '../context/SpeechContext';
import { useUser } from '../context/UserContext'; // adjust path as needed
import { appendTranscript, clearTranscript } from '../redux/slices/transcriptSlice';
import { deleteMeeting, getMeetings, updateMeeting } from '../utils/api';

const Upcoming = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [meetingToStart, setMeetingToStart] = useState(null);
  const { role } = useUser(); // Destructure role from context

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await getMeetings();
        setMeetings(response.meetings); // Assuming the response has a 'meetings' field
      } catch (error) {
        console.error('Failed to fetch meetings:', error);
      }
    };

    fetchMeetings();
  }, []);

  const handleDelete = async (meetingId) => {
    try {
      await deleteMeeting(meetingId);
      setMeetings((prevMeetings) => prevMeetings.filter(meeting => meeting._id !== meetingId));
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

  const handleSave = async () => {
    try {
      const updated = await updateMeeting(selectedMeeting);
      setMeetings((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Speech recognition logic
  const { setIsListening, setWithRecording } = useContext(SpeechContext);
  const dispatch = useDispatch();

  const handleStart = (meetingId, withRecording = false) => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        console.log('Live transcript:', interimTranscript);
      }

      if (finalTranscript) {
        dispatch(appendTranscript(finalTranscript.trim()));
        console.log('Final transcript:', finalTranscript);
      }
    };

    dispatch(clearTranscript()); // Clear only once at start
    setIsListening(true);

    if (withRecording) {
      console.log('Recording started...');
      setWithRecording(true);
    }

    recognition.start();
    navigate(`/room/${meetingId}`);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  };


  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-950 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-white">Upcoming Meetings</h3>
      </div>

      {(meetings?.length || 0) === 0 ? (
        <div className="flex justify-center items-center h-96 text-center">
          <div className="bg-[#1C1F2E] p-6 rounded-lg shadow-xl text-white">
            <h4 className="text-xl font-semibold mb-4">No Meetings Found</h4>
            <p className="text-gray-400">Looks like you don't have any upcoming meetings. Please schedule one!</p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {meetings.map((meeting, index) => (
            <div key={index} className="bg-[#1C1F2E] p-4 rounded-lg shadow relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="text-white hover:text-blue-400 cursor-pointer" onClick={() => {
                  setSelectedMeeting(meeting);
                  setIsEditModalOpen(true);
                }} style={{ display: role === 'admin' ? 'block' : 'none' }} >
                  <FaEdit />
                </button>
                <button
                  className="text-white hover:text-red-400 cursor-pointer"
                  onClick={() => handleDelete(meeting._id)} style={{ display: role === 'admin' ? 'block' : 'none' }}
                >
                  <FaTrashAlt />
                </button>
              </div>
              <div className="text-white mb-2">
                <FaRegCalendarAlt className="text-white text-2xl" />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <h4 className="font-semibold text-lg text-white">{meeting.title}</h4>
              </div>
              <p className="text-sm text-white mt-3">
                 {formatDateTime(meeting.date)}
              </p>


              <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex -space-x-3 flex-wrap sm:flex-nowrap justify-start">
                  <img src={user1} alt="User 1" className="w-8 h-8 rounded-full border-2 border-[#1C1F2E]" />
                  <img src={user2} alt="User 2" className="w-8 h-8 rounded-full border-2 border-[#1C1F2E]" />
                  <img src={user3} alt="User 3" className="w-8 h-8 rounded-full border-2 border-[#1C1F2E]" />
                  <img src={user4} alt="User 4" className="w-8 h-8 rounded-full border-2 border-[#1C1F2E]" />
                  <div className="w-8 h-8 rounded-full bg-[#2E3450] text-white text-xs flex items-center justify-center border-2 border-[#1C1F2E]">+9</div>
                </div>
                <div className="flex gap-2 justify-start sm:justify-end mt-4 sm:mt-0">
                  {new Date(meeting.date) <= new Date() && (
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer text-sm"
                      onClick={() => {
                        setMeetingToStart(meeting._id);
                        setIsStartModalOpen(true);
                      }}
                    >
                      Start
                    </button>
                  )}
                  <button
                    className="bg-[#252A41] text-white px-3 py-1 rounded cursor-pointer text-sm"
                    onClick={() => handleCopyInvitation(meeting._id)}
                  >
                    Copy Invitation
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <EditMeetingModal
        isOpen={isEditModalOpen}
        meeting={selectedMeeting}
        setMeeting={setSelectedMeeting}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
      />
      <StartMeetingModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        onStartWithRecording={() => {
          handleStart(meetingToStart, true);
          setIsStartModalOpen(false);
        }}
        onStartWithoutRecording={() => {
          handleStart(meetingToStart, false);
          setIsStartModalOpen(false);
        }}
      />
    </div>
  );
};

export default Upcoming;
