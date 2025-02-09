import { useEffect, useState, useRef } from "react";
import { FaSmile, FaTelegramPlane,FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import  {socket} from "../socket";  
import { motion } from "framer-motion";

interface ChatWindowProps {
    currentChat: any; // Replace 'any' with the appropriate type
    // socket: any; // Replace 'any' with the appropriate type
}

const ChatWindow = ({ currentChat }: ChatWindowProps) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState<string>("");

    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);//state to show or hide the emoji picker

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
        socket.on("message", (newMessage: any) => {
            console.log("Message received", newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]); // Update state with the new message from socket
        });

        //Listen for delete message event from socket.io server
        socket.on("deleteMessage",(msgId:string)=>{
            console.log("Delete Message Received",msgId);
            setMessages((prevMessages)=>prevMessages.filter((msg)=>msg.messageId!==msgId));//filter the messages array to remove the deleted message
        })
        

        return () => {
            socket.off("message"); // Cleanup listener on unmount what it does is it removes the listener for the message event when the component is unmounted
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
                    console.log("Message sent:", data.data.messageId);

                    socket.emit("message",{receiver:data.data.receiver,msg:data.data.text,msgId:data.data.messageId,sender:data.data.sender});//emit the message to the socket.io server

                    // socket.current?.emit("message", {receiver: currentChat.contactName,msg: message,msgId:data.data.messageId}); // Emit the message to the socket for real-time updates from below to up to send the msg id as well for deletion handling
                    // as now we have moved the emit to the .then block now we can also send the sender and receiver details from here only to the socket.io server that saves our db calls that we are doing in socket.io server backend code for getting the sender and receiver details
                });
        } catch (err) {
            console.log("Error sending message", err);
        }

        // Emit the message to the socket for real-time updates // to get the msgId in real time and send to socket.io server for delete msg handling we need to move this up to .then block so that we can get the msgId
        // socket.current?.emit("message", { receiver: currentChat.contactName, msg: message });

        setMessage(""); // Clear the message input box

        // Scroll to the bottom after sending the message
        scrollToBottom();
    };

    // Scroll to the bottom when new messages are fetched or updated
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    //Delete message
    const handleDeleteMessage=(msgid:string)=>{
        try{
            fetch("http://localhost:3000/deleteMessage",{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials:"include",
                body:JSON.stringify({msgId:msgid}),
            }).then((res)=>res.json()).then((data)=>{
                console.log("Delete Message Response",data);

                toast.success("Message Deleted Successfully",{position:"top-center",autoClose:2000});

                setMessages((prevMessages)=>prevMessages.filter((msg)=>msg.messageId!==msgid));//filter the messages array to remove the deleted message on the sender side but the receiver will still see the message as we are not updating the receiver's messages array here so we need to emit the delete message event to the socket.io server
            });

            socket.emit("deleteMessage",{msgId:msgid});//emit the delete message event to the socket.io server

            // setMessages((prevMessages)=>prevMessages.filter((msg)=>msg.messageId!==msgid));//filter the messages array to remove the deleted message

        }catch(err){
            console.log("Error deleting message",err);
        }
    }

    //Handle Emoji Click
    const handleEmojiClick=(emojiObject: any)=>{
            setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    }

    const handleKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white shadow-lg rounded-lg p-6">
            {/* Chat Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-[#814bff] pb-2"
            >
                <span className="ml-8">Chat with</span> <span className="text-[#814bff] italic">{currentChat?.contactName || "Select a contact"}</span>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                
                    {messages.map((msg: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className={`relative p-3 rounded-lg max-w-xs shadow-md ${
                                msg.sender.username === "You"
                                    ? "bg-gradient-to-r from-[#814bff] to-[#411caf] text-white ml-auto"
                                    : "bg-gray-200 text-gray-800"
                            }`}
                        >
                            <p className="text-sm font-semibold">{msg.sender.username}</p>
                            <p className="text-md mb-4">{msg.text}</p>
                            {msg.sender.username === "You" ? (
                                <p className="text-xs font-light italic mt-1 text-white absolute bottom-2 right-2">
                                    {new Date(msg.timestamp).toLocaleString()}
                                </p>
                            ) : (
                                <p className="text-xs font-light italic mt-1 text-gray-700 absolute bottom-2 right-2">
                                    {new Date(msg.timestamp).toLocaleString()}
                                </p>
                            )}

                            {/* Delete msg button*/}
                            {msg.sender.username === "You" && (
                                <button
                                    onClick={() => handleDeleteMessage(msg.messageId)}
                                    className="absolute flex items-center top-2 right-2 px-2 py-1 text-xs bg-[#ffffff] text-[#814bff] rounded-sm hover:bg-black border-0 hover:text-white transition-all cursor-pointer space-x-1"
                                >
                                    <span>Delete</span>
                                    <FaTrash size={14} />
                                </button>
                            )}
                        </motion.div>
                    ))}
               

                {/* The ref for scrolling */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Field */}
            <div className="relative flex items-center space-x-3 mt-4">
                {/* Emoji picker toggle btn */}
                <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-[#814bff] hover:text-[#411caf] focus:outline-none cursor-pointer relative"
                >
                    <FaSmile size={30} />
                </button>

                {/* Emoji Picker Dropdown */}
                {showEmojiPicker && (
                    <div 
                        className="absolute bottom-16 left-0 z-10 bg-white shadow-lg rounded-lg"
                    >
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onKeyDown={handleKeyDown}
                    onChange={(ev) => setMessage(ev.target.value)}
                    className="flex-1 p-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#814bff]"
                />

                <button
                    onClick={handleSendMessage}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#814bff] to-[#411caf] text-white rounded-lg hover:from-[#6f37f1] hover:to-[#301178] shadow-md transition-all cursor-pointer"
                >
                    <span>Send</span>
                    <FaTelegramPlane size={20} />
                </button>
            </div>
        </div>
    );
};
export default ChatWindow;
