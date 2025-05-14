import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { RiFilePdf2Fill } from 'react-icons/ri';
import { FaFileDownload } from 'react-icons/fa';
import { FaShare } from 'react-icons/fa';
import { getAllNotes, deleteNoteById, downloadNoteById } from '../utils/api';
import { useUser } from '../context/UserContext'; // adjust path as needed
const Recordings = () => {
  const [notes, setNotes] = useState([]);
 const { role } = useUser(); // Destructure role from context
  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch notes from the Notes collection using the API
  const fetchNotes = async () => {
    try {
      const data = await getAllNotes();
      setNotes(data.notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Download notes for a specific meeting
  const downloadNotes = async (meetingId) => {
    try {
      const blob = await downloadNoteById(meetingId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'meeting_notes.txt');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading notes:', error);
    }
  };

  // Truncate the summary to 1-2 lines (approx. 150 characters)
  const truncateSummary = (summary) => {
    if (!summary) return '';
    return summary.length > 150 ? summary.substring(0, 150) + '...' : summary;
  };

  // Delete a note
  const deleteNote = async (meetingId) => {
    try {
      await deleteNoteById(meetingId);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== meetingId));
      console.log('Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Share Notes function (same as before)
  const shareNotes = (note) => {
    const shareData = {
      title: note.meetingDetails.title,
      text: `Meeting: ${note.meetingDetails.title}\nDate: ${note.meetingDetails.date}\nSummary: ${note.summary || 'No summary available'}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Notes shared successfully!'))
        .catch((err) => console.error('Error sharing notes:', err));
    } else {
      const textToShare = `Meeting: ${note.meetingDetails.title}\nDate: ${note.meetingDetails.date}\nSummary: ${note.summary || 'No summary available'}`;
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-950 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-white">Meeting Recordings</h3>
      </div>

      {/* Conditionally render "No Meetings Found" message */}
      {notes.length === 0 ? (
        <div className="flex justify-center items-center h-96 text-center">
          <div className="bg-[#1C1F2E] p-6 rounded-lg shadow-xl text-white">
            <h4 className="text-xl font-semibold mb-4">No Meetings Found</h4>
            <p className="text-gray-400">Looks like you don't have any Recorded meetings. Please schedule one!</p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {notes.map((note) => (
            <div key={note._id} className="bg-[#1C1F2E] p-4 rounded-lg shadow rounded-xl relative">
              {/* Top-right icons */}
              <div className="absolute top-4 right-4 flex gap-2"  style={{ display: role === 'admin' ? 'block' : 'none' }}>
                <button
                  onClick={() => deleteNote(note._id)}  // Handle delete
                  className="text-white hover:text-red-400 cursor-pointer"
                >
                  <FaTrashAlt />
                </button>
              </div>

              {/* PDF Icon */}
              <div className="text-white mb-2">
                <RiFilePdf2Fill className="text-white text-2xl" />
              </div>

              {/* Meeting Info */}
              <div className="flex items-center gap-2 mt-3">
                <h4 className="font-semibold text-lg text-white">{note.meetingDetails.title}</h4>
              </div>
              <p className="text-sm text-white mt-3">{note.meetingDetails.date}</p>

              {/* Notes Summary */}
              {note.summary && (
                <div>
                  <h5 className="mt-3 font-semibold text-white">Summary:</h5>
                  <p className="text-white">{truncateSummary(note.summary)}</p>
                </div>
              )}

              {/* Download Button */}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => downloadNotes(note._id)}
                  className="bg-blue-600 text-white px-5 py-2 rounded flex items-center gap-1 text-sm cursor-pointer"
                >
                  <FaFileDownload className="h-4 w-4" />
                  Download Notes
                </button>
                <button
                  onClick={() => shareNotes(note)} // Share Notes Button
                  className="bg-[#252A41] text-white px-5 py-2 rounded text-sm flex items-center gap-1 cursor-pointer"
                >
                  <FaShare className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recordings;
