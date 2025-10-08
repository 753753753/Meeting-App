import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { AiOutlinePaperClip } from "react-icons/ai";
import { BiHappy } from "react-icons/bi";
import { MdSend } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import profile from '../assets/profile.png';
import { useUser } from "../context/UserContext";
import { getGroupMessages, sendGroupMessage } from "../utils/api"; // adjust path

export default function ChatUs() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);
  const { teamMembers } = useUser();
  const messagesContainerRef = useRef(null);
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const myUserId = loggedInUser?.id;

  useEffect(() => {
    async function fetchMessages() {
      try {
        const data = await getGroupMessages();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const sendMessageHandler = async () => {
    if (!input.trim()) return;

    try {
      const newMsg = await sendGroupMessage(input);

      const messageWithSender = {
        ...newMsg,
        sender: {
          _id: myUserId,
          name: loggedInUser?.name,
          email: loggedInUser?.email,
        },
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, messageWithSender]);
      setInput("");

      const updatedMessages = await getGroupMessages();
      setMessages(updatedMessages);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <>
      {teamMembers.length > 0 ? (
        <div className="flex flex-col h-full bg-gray-950 text-white rounded-lg shadow-lg">
          {/* Messages */}
          <div
            ref={messagesContainerRef} // <-- attach ref here
            className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar
             max-h-[calc(100vh-70px)] sm:max-h-full"
          >
            {loading ? (
              <p className="text-gray-400 text-center">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="text-gray-400 text-center">No messages yet</p>
            ) : (
              messages.map((msg) => {
                const isMine = msg.sender?._id === myUserId;

                return (
                  <div
                    key={msg._id}
                    className={`flex items-start mb-3 ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    {!isMine && (
                      <img
                        src={msg.sender?.image ? msg.sender?.image : profile}
                        alt={msg.sender?.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 object-cover mt-1"
                      />
                    )}

                    <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[70%] sm:max-w-[60%] md:max-w-[50%]`}>
                      <div
                        className={`relative px-4 py-2 sm:py-2.5 text-sm sm:text-base break-words flex flex-col
              ${isMine
                            ? "bg-blue-600 text-white rounded-lg rounded-br-none rounded-tr-none shadow-md after:content-[''] after:absolute after:w-3 after:h-3 after:bg-blue-600 after:rotate-45 after:right-0 after:translate-x-1/2 after:-translate-y-1/2"
                            : "bg-gray-700 text-gray-200 rounded-lg rounded-bl-none rounded-tl-none shadow-md after:content-[''] after:absolute after:w-3 after:h-3 after:bg-gray-700 after:rotate-45 after:left-0 after:-translate-x-1/2 after:-translate-y-1/2"
                          }`}
                      >
                        {!isMine && (
                          <span className="font-semibold text-xs sm:text-sm text-yellow-400 mb-0.5">
                            {msg.sender?.name || "Unknown"}
                          </span>
                        )}
                        <span className="text-[13px] sm:text-sm md:text-base">{msg.content}</span>
                        <span className="text-[10px] sm:text-[11px] text-gray-300 mt-1 self-end">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Area */}
          <div className="px-4 py-3 border-t border-gray-800 bg-gray-800 flex items-center gap-3">
            {/* Input container */}
            <div className="flex items-center flex-1 bg-gray-700 rounded-full px-3 py-2 gap-2">
              {/* Emoji Button */}
              <button
                className="text-gray-400 hover:text-gray-200"
                onClick={() => setShowEmoji(!showEmoji)}
              >
                <BiHappy size={22} className="sm:w-6 sm:h-6 w-5 h-5" />
              </button>
              {showEmoji && (
                <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                  {/* Overlay for a dimmed background */}
                  <div
                    className="absolute inset-0"
                    onClick={() => setShowEmoji(false)} // click outside to close
                  ></div>

                  {/* Emoji Picker Container */}
                  <div className="relative rounded-2xl shadow-2xl p-4">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                </div>
              )}

              {/* Input */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessageHandler()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
              />

              {/* Document / Attachment Button */}
              <button className="text-gray-400 hover:text-gray-200">
                <AiOutlinePaperClip size={22} className="sm:w-6 sm:h-6 w-5 h-5" />
              </button>
            </div>

            {/* Send Button */}
            <button
              onClick={sendMessageHandler}
              className="bg-blue-600 hover:bg-blue-500 rounded-full p-2 sm:p-3 flex items-center justify-center"
            >
              <MdSend size={20} className="sm:w-5 sm:h-5 w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl flex flex-col items-center space-y-4 border border-gray-700">
            <svg
              className="w-12 h-12 text-blue-500 animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2m10 0V6a5 5 0 00-10 0v2h10z"></path>
            </svg>
            <p className="text-white text-lg sm:text-xl font-semibold">
              Add your team members to start chatting!
            </p>
            <p className="text-gray-400 text-sm sm:text-base">
              Invite your colleagues and collaborate in real-time.
            </p>
            <button className="mt-2 bg-blue-600 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:bg-blue-500 hover:scale-105 transition duration-200 cursor-pointer" onClick={() =>
              navigate('/admindashboard')
            }>
              Add Team Members
            </button>
          </div>
        </div>
      )}
    </>

  );
}
