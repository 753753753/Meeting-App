import React from 'react';
import { FaRegCalendarAlt, FaTrashAlt, FaEdit } from 'react-icons/fa';
import user1 from '../assets/avatar.png';
import user2 from '../assets/avatar (1).png';
import user3 from '../assets/avatar (2).png';
import user4 from '../assets/avatar (3).png';
import { getPreviousMeetings, deletePreviousMeeting } from '../utils/api';
import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext'; // adjust path as needed
function Previous() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useUser(); // Destructure role from context
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await getPreviousMeetings();
        setMeetings(data || []); // ✅ Use data directly, not data.previousMeetings
      } catch (error) {
        console.error('Error fetching previous meetings:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePreviousMeeting(id);
      setMeetings((prev) => prev.filter((meeting) => meeting._id !== id));
    } catch (error) {
      console.error('Error deleting meeting:', error.message);
    }
  };
  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-950 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-white">Previous Meetings</h3>
      </div>

      {loading ? (
        <p className="text-white">Loading meetings...</p>
      ) : meetings.length === 0 ? (
        <div className="flex justify-center items-center h-96 text-center">
          <div className="bg-[#1C1F2E] p-6 rounded-lg shadow-xl text-white">
            <h4 className="text-xl font-semibold mb-4">No Meetings Found</h4>
            <p className="text-gray-400">Looks like you don't have any Previous meetings. Please schedule one!</p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {meetings.map((meeting, index) => (
            <div
              key={index}
              className="bg-[#1C1F2E] p-4 rounded-lg shadow relative"
            >
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="text-white hover:text-red-400 cursor-pointer" onClick={() => handleDelete(meeting._id)}  style={{ display: role === 'admin' ? 'block' : 'none' }}>
                  <FaTrashAlt />
                </button>
              </div>

              <div className="text-white">
                <FaRegCalendarAlt className="mb-2 text-2xl" />
                <h4 className="font-semibold text-lg">{meeting.title}</h4>
                <p className="text-sm mt-2">
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
              </div>

              <div className="mt-5 flex -space-x-3">
                <img src={user1} alt="User 1" className="w-8 h-8 rounded-full border-2 border-[#1C1F2E]" />
                <img src={user2} alt="User 2" className="w-8 h-8 rounded-full border-2 border-[#1C1F2E]" />
                <img src={user3} alt="User 3" className="w-8 h-8 rounded-full border-2 border-[#1C1F2E]" />
                <img src={user4} alt="User 4" className="w-8 h-8 rounded-full border-2 border-[#1C1F2E]" />
                <div className="w-8 h-8 rounded-full bg-[#2E3450] text-white text-xs flex items-center justify-center border-2 border-[#1C1F2E]">
                  +9
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Previous;
