import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from 'react';
import { AiOutlinePaperClip } from "react-icons/ai";
import { BiHappy } from "react-icons/bi";
import { MdSend } from "react-icons/md";
import { useUser } from '../../context/UserContext';
import { fetchLeaderMessages, fetchTeamLeader, sendMessageAPI } from '../../utils/api';
function TeamLeader() {
  const { user, role, token } = useUser();
  const [messages, setMessages] = useState([]);
  const messagesContainerRef = useRef(null);
  const [input, setInput] = useState("");
  const [teamLeader, setTeamLeader] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;
      const data = await fetchLeaderMessages();
      setMessages(data);
      scrollToBottom();
    };
    fetchMessages();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTeamLeader();
      setTeamLeader(data.teamLeader);
    };
    fetchData();
  }, [role, token]);


  const sendMessageHandler = async () => {
    if (!input.trim()) return;

    const newMessage = {
      sender: { _id: user.id, name: user.name, image: user.image },
      receiverId: "teamLeaderId", // replace with the actual team leader's ID
      content: input,
      createdAt: new Date(),
    };

    // Optimistic update
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      await sendMessageAPI(user.id, teamLeader._id, input);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };


  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const onEmojiClick = (emojiObject) => {
    setInput((prev) => prev + emojiObject.emoji);
  };

  return (

    <div className="flex flex-col h-full bg-gray-950 text-white shadow-lg border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-800 bg-gray-900">
        {teamLeader?.image ? (
          <img
            src={teamLeader.image}
            alt={teamLeader?.name || "Team Leader"}
            className="w-10 h-10 rounded-full object-cover border border-gray-600 mr-3"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white border border-gray-600 mr-3"
            style={{
              backgroundColor: teamLeader?.name
                ? `hsl(${teamLeader.name.charCodeAt(0) * 15 % 360}, 70%, 50%)`
                : "#999"
            }}
          >
            {teamLeader?.name ? teamLeader.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}

        <div>
          <p className="font-semibold text-white">{teamLeader?.name}</p>
          <p className="text-sm text-gray-400">online</p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
      >
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">No messages yet</p>
        ) : (
          messages.map((msg, index) => {
            const isMine = msg.sender._id ? msg.sender._id === user.id : msg.sender === user.id;

            return (
              <div
                key={index}
                className={`flex ${isMine ? "justify-end" : "justify-start"} mb-3 px-2`}
              >
                <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[75%]`}>
                  <div
                    className={`relative px-4 py-2 sm:py-2.5 text-sm sm:text-base break-words flex flex-col
        ${isMine
                        ? "bg-blue-600 text-white rounded-2xl rounded-br-none shadow-lg hover:shadow-blue-400 transition-shadow duration-200"
                        : "bg-gray-700 text-gray-200 rounded-2xl rounded-bl-none shadow-lg hover:shadow-gray-500 transition-shadow duration-200"
                      }`}
                  >
                    <span className="text-[13px] sm:text-sm md:text-base leading-relaxed">
                      {msg.content}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-gray-300 mt-1 self-end">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

            );
          })
        )}
      </div>

      {/* Input */}
      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-800 bg-gray-800 flex items-center gap-3">
        {/* Input container */}
        <div className="flex items-center flex-1 bg-gray-700 rounded-full px-3 py-2 gap-2">
          {/* Emoji Button */}
          <button
            className="text-gray-400 hover:text-gray-200"
            onClick={() => setShowEmoji(!showEmoji)}
          >
            <BiHappy className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessageHandler()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
          />

          {/* Attachment / Document */}
          <button className="text-gray-400 hover:text-gray-200">
            <AiOutlinePaperClip className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Send Button */}
        <button
          onClick={sendMessageHandler}
          className="bg-blue-600 hover:bg-blue-500 rounded-full p-2 sm:p-3 flex items-center justify-center"
        >
          <MdSend className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Emoji Picker */}
        {showEmoji && (
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div
              className="absolute inset-0"
              onClick={() => setShowEmoji(false)}
            ></div>
            <div className="relative rounded-2xl shadow-2xl p-4">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default TeamLeader;
