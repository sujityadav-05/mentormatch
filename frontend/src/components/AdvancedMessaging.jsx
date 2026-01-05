import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { Send, Check, CheckCheck, Clock } from "lucide-react";
import { axiosInstance } from "../lib/axios";

export const AdvancedMessageInput = ({ receiverId }) => {
  const { sendMessage, socket } = useChatStore();
  const { authUser } = useAuthStore();
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Handle typing indicator
  const handleTyping = (e) => {
    setText(e.target.value);

    if (!isTyping && socket) {
      setIsTyping(true);
      socket.emit("typing", { receiverId, isTyping: true });
    }

    // Clear previous timeout
    if (typingTimeout) clearTimeout(typingTimeout);

    // Set new timeout to stop typing indicator after 3 seconds
    const timeout = setTimeout(() => {
      if (socket) {
        socket.emit("typing", { receiverId, isTyping: false });
      }
      setIsTyping(false);
    }, 3000);

    setTypingTimeout(timeout);
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage({ receiverId, text });
    setText("");

    if (socket) {
      socket.emit("typing", { receiverId, isTyping: false });
    }
  };

  return (
    <div className="flex gap-3 items-end border-t p-4">
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={handleTyping}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
        className="input input-bordered flex-1"
      />
      <button onClick={handleSend} className="btn btn-primary btn-square">
        <Send size={20} />
      </button>
    </div>
  );
};

export const MessageItem = ({ message, isOwn, isSeen }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg flex gap-2 items-end ${
          isOwn ? "bg-primary text-primary-content" : "bg-base-200"
        }`}
      >
        <div className="flex-1">
          <p className="text-sm break-words">{message.text}</p>
          <p className={`text-xs mt-1 ${isOwn ? "text-primary-content/70" : "text-gray-500"}`}>
            {formatTime(message.createdAt)}
          </p>
        </div>

        {isOwn && (
          <div className="flex-shrink-0">
            {message.status === "sent" && <Clock size={14} />}
            {message.status === "delivered" && <Check size={14} />}
            {message.status === "read" && <CheckCheck size={14} />}
          </div>
        )}
      </div>
    </div>
  );
};

export const TypingIndicator = ({ isTyping }) => {
  if (!isTyping) return null;

  return (
    <div className="flex gap-1 items-center p-3">
      <span className="text-sm text-gray-500">User is typing</span>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      </div>
    </div>
  );
};

export const MessageSearch = ({ receiverId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const res = await axiosInstance.get(`/messages/search/${receiverId}?query=${query}`);
      setSearchResults(res.data);
      setShowResults(true);
    } catch (error) {
      console.log("Error searching messages:", error);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search messages..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="input input-bordered input-sm w-full"
      />

      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-base-100 border rounded-lg mt-1 z-10 max-h-40 overflow-y-auto">
          {searchResults.map((msg) => (
            <div key={msg._id} className="p-2 hover:bg-base-200 cursor-pointer text-sm">
              <p className="truncate">{msg.text}</p>
              <p className="text-xs text-gray-500">
                {new Date(msg.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
