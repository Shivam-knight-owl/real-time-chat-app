import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import AddContact from "../components/AddContact";
import ChatWindow from "../components/ChatWindow";
import ContactList from "../components/ContactList";

interface ChatProps {
    user: any; // Replace 'any' with the appropriate type if known
}

const Chat = ({}: ChatProps) => {
    const socket = useRef<ReturnType<typeof io> | null>(null); //socket connection to the server is stored in this ref variable

    const [currentChat,setCurrentChat]=useState(null);//store the current chat with the user

    const[contacts,setContacts]=useState<any[]>([]);//store the contacts array of the user//this was earlier in ContactList component but we moved it here since we need to pass the setContacts fn to ContactList component as well as addContact component to setContacts for real time update of contacts

    useEffect(()=>{

        //initialize the socket connection
        socket.current=io("http://localhost:3000",{
            withCredentials:true,//send the cookies to the server
            transports:["websocket"],//use websocket protocol
        });

        socket.current?.on("connect",()=>{
            console.log("connected to the socket.io server");
        });
        
        //cleanup the socket connection when the component is unmounted since if we don't do this,old socket connection will remain open and new socket connection will be created when the component is mounted again

        return ()=>{
            socket.current?.disconnect();//disconnect the socket connection
        }

    },[]);

   return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Sidebar */}
            <div className="w-1/4 bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">

                <div className="flex-shrink-0">
                    <AddContact setContacts={setContacts} />
                </div>
                <div className="flex-1 overflow-y-auto">
                    <ContactList
                        onSelectingContact={setCurrentChat}
                        setContacts={setContacts}
                        contacts={contacts}
                    />
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-gray-100 flex flex-col">
                {currentChat ? (
                    <ChatWindow currentChat={currentChat} socket={socket} />
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