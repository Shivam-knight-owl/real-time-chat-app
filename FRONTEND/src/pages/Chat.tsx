import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
import AddContact from "../components/AddContact";
import ChatWindow from "../components/ChatWindow";
import ContactList from "../components/ContactList";
import { FiMenu } from "react-icons/fi";
import {socket} from "../socket";
interface ChatProps {
    user: any;
}

const Chat = ({ user }: ChatProps) => {
    // const socket = useRef<ReturnType<typeof io> | null>(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [contacts, setContacts] = useState<any[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar toggle state

    const [activeUsers,setActiveUsers]=useState<any[]>([]);//store the active users moved from contactlist to here as sidebar toggle made the whole children re-render and the active users list was getting reset

    useEffect(() => {
        // socket.current = io("http://localhost:3000", {
        //     withCredentials: true,
        // });
        if (!socket.connected) {
            socket.connect(); // Ensure socket connection
        }
        if (socket.connected) {
            console.log("Socket is already connected");
        } else {
            socket.on("connect", () => {
                console.log("Connected to the socket.io server");
            });
        }

        //listen for activeUsers event from the server to update the contacts list of the user when the user is online or offline              
        console.log("Socket", socket);  
        socket.on("activeUsers",(data:any)=>{
            console.log("Active Users",data);
            setActiveUsers(()=>[...data.activeUsers,""]);
            console.log("Active Users",activeUsers);    
        });

        // listen for "addContact" event from the server to update the contacts list of the receiver when the sender adds a contact
        socket.on("addedContact", (data: any) => {
            // console.log("Contact added", contacts);
            console.log("Contact added", data.sender);
            setActiveUsers((prevActiveUsers)  =>[...prevActiveUsers,""] );//setActiveUsers when a new contact is added
            setContacts((prevContacts) => [...prevContacts, data.sender]);// Use functional form to update the contacts array with the new contact

        });
        return () => {
            socket.disconnect();
            // socket.off("activeUsers");
            // socket.off("addedContact");
        };
    }, []);

    // Log activeUsers whenever it changes;
    console.log("Active Users updated", activeUsers);

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Sidebar */}
            <div className={`bg-gradient-to-b from-gray-900 to-gray-800 transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-1/4" : "w-0 overflow-hidden"}`}>
                {isSidebarOpen && (
                    <div className="flex flex-col h-full">
                        {/* Add Contact */}
                        <div className="flex-shrink-0">
                            <AddContact setContacts={setContacts}  user={user} />
                        </div>
                        {/* Contact List - Ensures Full Height Usage */}
                        <div className="flex-grow overflow-y-auto">
                            <ContactList
                                onSelectingContact={setCurrentChat}
                                setContacts={setContacts}
                                contacts={contacts}
                                activeUsers={activeUsers}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-gray-100 flex flex-col relative">
                {/* Sidebar Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute left-2 top-5 bg-[#814bff] text-white p-2 rounded-md shadow-md focus:outline-none cursor-pointer"
                >
                    <FiMenu size={20} />
                </button>

                {currentChat ? (
                    <ChatWindow currentChat={currentChat}  />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-md text-gray-800 font-semibold">
                            Select a contact to start chatting.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
