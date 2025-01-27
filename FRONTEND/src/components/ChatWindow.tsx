import { useEffect, useState, useRef } from "react";
import { FaTelegramPlane } from "react-icons/fa";

interface ChatWindowProps {
    currentChat: any; // Replace 'any' with the appropriate type
    socket: any; // Replace 'any' with the appropriate type
}

const ChatWindow = ({ currentChat, socket }: ChatWindowProps) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState<string>("");

    // Reference to the messages container to control scroll
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to the bottom whenever new messages are added
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        // Fetch previous messages for the selected contact
        fetch(`http://localhost:3000/messages/${currentChat.contactName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Messages fetched", data);
                setMessages(data.messages); // Update the messages array with the fetched messages
            });

        // Listen for incoming messages from socket (real-time)
        socket.current?.on("message", (newMessage: any) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]); // Update state with the new message from socket
        });

        return () => {
            socket.current?.off("message"); // Cleanup listener on unmount
        };
    }, [currentChat, socket]); // Fetch messages and listen to socket updates whenever `currentChat` or `socket` changes

    const handleSendMessage = () => {
        if (!message) return; // If message is empty, return

        // Send the message to the server and socket, but do NOT update the state here
        try {
            console.log("Receiver:", currentChat?.contactName);
            console.log("Message:", message);
            fetch("http://localhost:3000/sendMessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    receiver: currentChat?.contactName, // ? to avoid undefined error
                    msg: message,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Message sent:", data);
                });
        } catch (err) {
            console.log("Error sending message", err);
        }

        // Emit the message to the socket for real-time updates
        socket.current?.emit("message", { receiver: currentChat.contactName, msg: message });

        setMessage(""); // Clear the message input box

        // Scroll to the bottom after sending the message
        scrollToBottom();
    };

    // Scroll to the bottom when new messages are fetched or updated
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-white shadow-lg rounded-lg p-6">
            {/* Chat Header */}
            <div className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-[#814bff] pb-2">
                Chat with <span className="text-[#814bff] italic">{currentChat?.contactName || "Select a contact"}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((msg: any, index: number) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg max-w-xs shadow-md ${
                            msg.sender.username === "You"
                                ? "bg-gradient-to-r from-[#814bff] to-[#411caf] text-white ml-auto"
                                : "bg-gray-200 text-gray-800"
                        }`}
                    >
                        <p className="text-sm font-semibold">{msg.sender.username}</p>
                        <p className="text-sm">{msg.text}</p>
                        {msg.sender.username === "You" ? (
                            <p className="text-xs font-light italic mt-1 text-white">
                                {new Date(msg.timestamp).toLocaleString()}
                            </p>
                        ) : (
                            <p className="text-xs font-light italic mt-1 text-gray-700">
                                {new Date(msg.timestamp).toLocaleString()}
                            </p>
                        )}
                    </div>
                ))}

                {/* The ref for scrolling */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Field */}
            <div className="flex items-center space-x-3 mt-4">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(ev) => setMessage(ev.target.value)}
                    className="flex-1 p-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#814bff]"
                />
                <button
                    onClick={handleSendMessage}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#814bff] to-[#411caf] text-white rounded-lg hover:from-[#6f37f1] hover:to-[#301178] shadow-md transition-all cursor-pointer">

                    <span>Send</span>
                    <FaTelegramPlane size={20} />
                    
                </button>

            </div>
        </div>
    );
};

export default ChatWindow;
