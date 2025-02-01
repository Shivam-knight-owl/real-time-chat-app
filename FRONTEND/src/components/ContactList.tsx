import { useEffect } from "react";

interface ContactListProps {
    onSelectingContact: (contact: any) => void;
    setContacts: (contacts: any[] | ((prevContacts: any[]) => any[])) => void;
    contacts: any[];
    // socket: any;
    activeUsers:any[];
}
import {socket} from "../socket";

const ContactList = ({ onSelectingContact, setContacts,contacts,activeUsers }: ContactListProps) => {

    useEffect(() => {
        try {
            fetch("http://localhost:3000/contacts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // send the cookies to the server
            }).then((res) => res.json()).then((data) => {
                console.log("Contacts fetched", data);
                // console.log("Contacts",contacts);
                setContacts(data.contacts);

                // emit the contactlist of a user to socket.io server and then check if the user is online/active or offline using the userMap in the server which stores the socket id of the active users
                // socket.emit("activeUsers",{contacts:data.contacts});//emit the contacts list of the user to the server to check if the user is online or offline
            });

            // listen for "addContact" event from the server to update the contacts list of the receiver when the sender adds a contact
            console.log("Socket", socket);
            socket.on("addedContact", (data: any) => {
            // console.log("Contact added", contacts);
            console.log("Contact added", data.sender);
            setContacts((prevContacts) => [...prevContacts, data.sender]); // Use functional form to update the contacts array with the new contact
            });  
        
            return () => {
                socket.off("addedContact");
            };
        } catch (err) {
            console.log("Error fetching contacts", err);
        }
    }, [socket]);


    // Helper function to extract first letter from contactName
    const getInitials = (name: string) => {
        const initials = name.split(" ").map((word: string) => word.charAt(0)).join("");
        return initials.toUpperCase();
    };

    return (
        <div className=" text-white p-6 h-full shadow-lg ">
            <h1 className="text-xl font-semibold text-center mb-6 text-gradient">
                Your Contacts
            </h1>
            <div className="space-y-4">
                {contacts.map((contact: any, index: number) => (
                    <div
                        key={index}
                        className="p-2 bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gradient-to-r from-[#814bff] to-[#411caf] hover:scale-105 transition duration-300 transform"
                        onClick={() => {
                            console.log("Contact Selected", contact);
                            onSelectingContact(contact); // set the current chat with the selected contact
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            {/* Circle avatar with first letter of username */}
                            <div className="w-10 h-10 bg-gradient-to-r from-[#814bff] to-[#411caf] text-white rounded-full flex items-center justify-center font-bold text-lg">
                                {getInitials(contact.contactName)}
                            </div>
                            <div>
                                <h2 className="text-md font-semibold italic">{contact.contactName}</h2>
                                {/* show online/offline */}
                                {/* .some() checks if at least one object in activeUsers has contactuserId matching contact.contactuserId. */}
                                <p className="text-sm">
                                    {activeUsers.some(user => user.contactuserId === contact.contactuserId) ? (
                                        <span className="text-green-500">Online</span>
                                    ) : (
                                        <span className="text-gray-400">Offline</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ContactList;
