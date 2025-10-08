import { compareAsc, format, isToday, parseISO } from "date-fns";
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { MdAdd, MdOutlineVideoLibrary, MdSchedule, MdVideoCall } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import user2 from '../assets/avatar (1).png';
import user3 from '../assets/avatar (2).png';
import user4 from '../assets/avatar (3).png';
import user1 from '../assets/avatar.png';
import bgImage from '../assets/background.png';
import EditMeetingModal from '../Components/Modal/EditMeetingModal';
import MeetingModal from '../Components/Modal/MeetingModal';
import StartMeetingModal from '../Components/Modal/StartMeetingModal';
import { SpeechContext } from '../context/SpeechContext';
import { useUser } from '../context/UserContext'; // adjust path as needed
import { deleteMeeting, getMeetings, updateMeeting } from '../utils/api';

export default function Home() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [meetingToStart, setMeetingToStart] = useState(null);
  const { setWithRecording } = useContext(SpeechContext);
  const { role, user } = useUser(); // Destructure role from context

  const actions = [
    {
      label: 'New Meeting',
      type: 'new',
      text: "Start an instant meeting",
      color: 'bg-orange-500',
      icon: <MdAdd size={24} />,
    },
    {
      label: 'Join Meeting',
      type: 'join',
      text: "Via invitation link",
      color: 'bg-blue-500',
      icon: <MdVideoCall size={24} />,
    },
    {
      label: 'Schedule Meeting',
      type: 'schedule',
      text: "Plan your meeting",
      color: 'bg-purple-500',
      icon: <MdSchedule size={24} />,
    },
    {
      label: 'View Recordings',
      type: 'view',
      text: "Check out your recordings",
      color: 'bg-yellow-500',
      icon: <MdOutlineVideoLibrary size={24} />,
    },
  ];

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await getMeetings();
        setMeetings(response.meetings); // Use `response.meetings` to set the state
      } catch (error) {
        console.error('Failed to fetch meetings:', error);
      }
    };

    fetchMeetings();
  }, []);

  const todayMeetings = meetings
    .filter(meeting => isToday(parseISO(meeting.date)))
    .sort((a, b) => compareAsc(parseISO(`${a.date}T${a.time}`), parseISO(`${b.date}T${b.time}`)));

  const nextMeeting = todayMeetings.length > 0 ? todayMeetings[0] : null;
  const upcomingMeetingTime = nextMeeting ? new Date(nextMeeting.date) : null;


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
  const { setTranscript, setIsListening } = useContext(SpeechContext);
  const handleStart = (meetingId, withRecording = false) => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }

      setTranscript(prevTranscript => {
        if (prevTranscript !== currentTranscript) {
          return currentTranscript;
        }
        return prevTranscript;
      });

      console.log("Live transcript:", currentTranscript);
    };

    setTranscript("");
    setIsListening(true);

    if (withRecording) {
      // Trigger your recording logic here
      console.log("Recording started...");
      setWithRecording(true);
    }

    recognition.start();
    navigate(`/room/${meetingId}`);
  };

  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = dateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });


  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Top section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-cover bg-center bg-no-repeat p-6 rounded-xl shadow mb-6 text-white h-48 flex flex-col justify-between"
          style={{ backgroundImage: `url(${bgImage})` }}
        >

          {(role === 'admin' || (role === 'user' && user?.teamLeader)) && (
            <div className="text-sm bg-[#FFFFFF0D] bg-opacity-50 px-3 py-1 rounded w-fit">
              {upcomingMeetingTime && !isNaN(upcomingMeetingTime) ? (
                <>👉 Upcoming Meeting at: {(() => {
                  const iso = new Date(upcomingMeetingTime).toISOString().slice(11, 16); // "01:33"
                  let [hour, minute] = iso.split(":").map(Number);
                  const ampm = hour >= 12 ? "PM" : "AM";
                  hour = hour % 12 || 12; // convert 0 -> 12
                  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${ampm}`;
                })()}</>
              ) : (
                <>No Upcoming Meeting Today 😄</>
              )}
            </div>
          )}

          <div>
            <h2 className="text-4xl font-bold">{time}</h2>
            <p className="text-lg mt-1">{date}</p>
          </div>
        </motion.div>

        {/* Action Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {actions.map((item) => (
            <motion.div
              key={item.label}
              onClick={() => {
                switch (item.type) {
                  case 'schedule':
                    if (role === 'admin') setActiveModal('schedule');
                    else alert('Only admin can access the schedule feature.');
                    break;
                  case 'view':
                    if (role === 'admin' || user.teamLeader) {
                      navigate('/recordings');
                    } else {
                      alert(
                        'You don’t have a team leader yet. Once a leader is assigned, your recordings will appear.'
                      );
                    }
                    break;
                  case 'new':
                  case 'join':
                    setActiveModal(item.type);
                    break;
                  default:
                    console.warn('Unknown action type:', item.type);
                }
              }}
              whileHover={{ scale: 1.07 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={`rounded-xl text-white p-4 sm:p-6 shadow-md cursor-pointer ${item.color} flex flex-col items-start gap-2 sm:gap-3 transform transition-transform`}
            >
              <div className="bg-[#FFFFFF5E] px-1 py-1 rounded w-fit">{item.icon}</div>
              <p className="font-semibold text-base sm:text-lg mt-3 sm:mt-5 break-words">
                {item.label}
              </p>
              <p className="text-xs sm:text-sm break-words">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Upcoming Meetings */}
        <div>
          {(role === 'admin' || (role === 'user' && user?.teamLeader)) ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-4 gap-2">
                <h3 className="text-xl font-semibold text-white">Today’s Upcoming Meetings</h3>
                <button
                  onClick={() => navigate('/upcoming')}
                  className="text-white hover:underline cursor-pointer text-sm sm:text-base"
                >
                  See all
                </button>
              </div>

              {/* Meetings List */}
              {todayMeetings.length > 0 ? (
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {todayMeetings.map((meeting, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="bg-[#1C1F2E] p-4 rounded-lg shadow"
                    >
                      <div className="absolute top-4 right-4 flex gap-2"></div>
                      <div className="text-white mb-2">
                        <FaRegCalendarAlt className="text-white text-2xl" />
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <h4 className="font-semibold text-lg text-white">{meeting.title}</h4>
                      </div>
                      <p className="text-sm text-white mt-3">
                        {(() => {
                          const iso = new Date(meeting.date).toISOString().slice(0, 16); // "2025-10-09T01:33"
                          const [datePart, timePart] = iso.split("T");
                          let [year, month, day] = datePart.split("-");
                          let [hour, minute] = timePart.split(":").map(Number);
                          const ampm = hour >= 12 ? "PM" : "AM";
                          hour = hour % 12 || 12; // convert 0 -> 12
                          return `${day}-${month}-${year}, ${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${ampm}`;
                        })()}
                      </p>

                      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex -space-x-3 flex-wrap sm:flex-nowrap justify-start">
                          <img src={user1} alt="User 1" className="w-8 h-8 rounded-full border-2 border-[#1C1F2E]" />
                          <img src={user2} alt="User 2" className="w-8 h-8 rounded-full border-2 border-[#1C1F2E]" />
                          <img src={user3} alt="User 3" className="w-8 h-8 rounded-full border-2 border-[#1C1F2E]" />
                          <img src={user4} alt="User 4" className="w-8 h-8 rounded-full border-2 border-[#1C1F2E]" />
                          <div className="w-8 h-8 rounded-full bg-[#2E3450] text-white text-xs flex items-center justify-center border-2 border-[#1C1F2E]">
                            +9
                          </div>
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
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="p-6 rounded-2xl shadow-xl text-center text-white max-w-md mx-auto mt-10"
                >
                  <p className="text-2xl mb-2">🎉 No meetings today!</p>
                  <p className="text-sm text-gray-300">You're all caught up. Enjoy your day! 😄</p>
                </motion.div>
              )}
            </>
          ) : (
            // User has no team leader → show friendly message
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.02, y: -3 }}
              className="p-6 rounded-2xl shadow-xl text-center text-white max-w-md mx-auto mt-10"
            >
              <p className="text-2xl mb-2">👋 No Team Leader Assigned!</p>
              <p className="text-sm text-gray-300">
                You don’t have a team leader yet. Once a leader is assigned, your upcoming meetings will appear here.
              </p>
            </motion.div>
          )}
        </div>

      </div>

      {/* Modal */}
      <MeetingModal activeModal={activeModal} setActiveModal={setActiveModal} />
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
}
