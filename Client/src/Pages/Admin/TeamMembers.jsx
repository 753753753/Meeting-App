import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { AiOutlinePaperClip, AiOutlineSearch } from "react-icons/ai";
import { BiHappy } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../context/UserContext";
import { fetchMessagesAPI, sendMessageAPI } from "../../utils/api";

function TeamMembers() {
    const { teamMembers } = useUser();
    const [selectedMember, setSelectedMember] = useState(null);
    const [input, setInput] = useState("");
    const [search, setSearch] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [messages, setMessages] = useState([]);
    const messagesContainerRef = useRef(null);
    const navigate = useNavigate();

    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const myUserId = loggedInUser?.id;

    // Send message handler
    const sendMessageHandler = async () => {
        if (!input.trim() || !selectedMember) return;

        const newMessage = {
            sender: { _id: myUserId, name: loggedInUser.name, image: loggedInUser.image },
            receiverId: selectedMember._id,
            content: input,
            createdAt: new Date(),
        };

        // Optimistic UI update
        setMessages((prev) => [...prev, newMessage]);
        setInput("");

        try {
            await sendMessageAPI(myUserId, selectedMember?._id, input);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    // Fetch messages when a member is selected
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedMember) return;

            try {
                const data = await fetchMessagesAPI(myUserId, selectedMember?._id);
                setMessages(data);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        fetchMessages();
    }, [selectedMember]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const onEmojiClick = (emojiObject) => {
        setInput((prev) => prev + emojiObject.emoji);
    };

    // Filtered team members for search
    const filteredMembers = teamMembers.filter((member) =>
        member.name.toLowerCase().includes(search.toLowerCase())
    );

    // Render chat window
    if (selectedMember) {
        return (
            <div className="flex flex-col h-full bg-gray-950 text-white shadow-lg border border-gray-800 overflow-hidden">
                {/* Header */}
                <div className="flex items-center p-4 border-b border-gray-800 bg-gray-900">
                    <button
                        onClick={() => setSelectedMember(null)}
                        className="text-gray-300 hover:text-white mr-3 text-lg cursor-pointer"
                    >
                        <FaArrowLeft />
                    </button>
                    {selectedMember?.image ? (
                        <img
                            src={selectedMember.image}
                            alt={selectedMember?.name || "Member"}
                            className="w-10 h-10 rounded-full object-cover border border-gray-600 mr-3"
                        />
                    ) : (
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white border border-gray-600 mr-3"
                            style={{
                                backgroundColor: selectedMember?.name
                                    ? `hsl(${selectedMember.name.charCodeAt(0) * 15 % 360}, 70%, 50%)`
                                    : "#999"
                            }}
                        >
                            {selectedMember?.name ? selectedMember.name.charAt(0).toUpperCase() : "U"}
                        </div>
                    )}

                    <div>
                        <p className="font-semibold text-white">{selectedMember.name}</p>
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
                            const isMine = msg.sender._id ? msg.sender._id === myUserId : msg.sender === myUserId;
                            console.log("senderid", msg.sender);
                            console.log("userid", myUserId);
                            return (
                                <div
                                    key={index}
                                    className={`flex items-start ${isMine ? "justify-end" : "justify-start"
                                        }`}
                                >

                                    <div
                                        className={`flex flex-col ${isMine ? "items-end" : "items-start"
                                            } max-w-[70%] sm:max-w-[60%] md:max-w-[50%]`}
                                    >
                                        <div
                                            className={`relative px-4 py-2 sm:py-2.5 text-sm sm:text-base break-words flex flex-col ${isMine
                                                ? "bg-blue-600 text-white rounded-lg rounded-br-none rounded-tr-none shadow-md"
                                                : "bg-gray-700 text-gray-200 rounded-lg rounded-bl-none rounded-tl-none shadow-md"
                                                }`}
                                        >
                                            <span className="text-[13px] sm:text-sm md:text-base">
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

    // Member list with search
    return (
        <>
            {teamMembers.length > 0 ? (
                <div className="max-w-5xl w-full px-0 md:px-8 pb-8 mt-0 md:mt-4">
                    {/* Search */}
                    <div className="p-3">
                        <div className="flex items-center bg-gray-800 rounded-full px-4 py-2 transition-all focus-within:ring-2 focus-within:ring-blue-500">
                            <AiOutlineSearch className="text-gray-400 mr-2" size={20} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search Your Team Members..."
                                className="bg-transparent text-white placeholder-gray-400 w-full focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col bg-gray-900 rounded-xl overflow-hidden border border-gray-700 mt-2">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member, index) => (
                                <div
                                    key={member._id}
                                    onClick={() => setSelectedMember(member)}
                                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-800 transition-colors ${index !== filteredMembers.length - 1 ? "border-b border-gray-700" : ""
                                        }`}
                                >
                                    {member?.image ? (
                                        <img
                                            src={member.image}
                                            alt={member?.name || "Member"}
                                            className="w-12 h-12 rounded-full object-cover border border-gray-600 mr-4"
                                        />
                                    ) : (
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white border border-gray-600 mr-4"
                                            style={{
                                                backgroundColor: member?.name
                                                    ? `hsl(${member.name.charCodeAt(0) * 15 % 360}, 70%, 50%)`
                                                    : "#999"
                                            }}
                                        >
                                            {member?.name ? member.name.charAt(0).toUpperCase() : "U"}
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-white truncate">{member.name}</p>
                                            <span className="text-sm text-gray-400">online</span>
                                        </div>
                                        <p className="text-gray-400 text-sm truncate">
                                            Hey there! I’m using this app 👋
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-6">No team members found.</p>
                        )}
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
                            You don’t have any team members to chat with.
                        </p>
                        <p className="text-gray-400 text-sm sm:text-base">
                            Invite your team members to start chatting!
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

export default TeamMembers;
