import { useEffect, useState } from "react";

interface ContactListProps {
    onSelectingContact: (contact: any) => void;
    setContacts: (contacts: any[] | ((prevContacts: any[]) => any[])) => void;
    contacts: any[];
    // socket: any;
    activeUsers:any[];
}
import {socket} from "../socket";
import { FaSearch } from "react-icons/fa";

const ContactList = ({ onSelectingContact, setContacts,contacts,activeUsers }: ContactListProps) => {

    //to search a contact
    const [searchContact,setSearchContact]=useState<string>("");

    const handleSearchContact = (query: string) => {
        setSearchContact(query);//update the searchContact state with the query
    };

    //make a new filteredContacts array to store the contacts that match the search query
    const filteredContacts = searchContact.trim()
    ? contacts.filter((contact) =>
          contact.contactName.toLowerCase().includes(searchContact.toLowerCase())
      )
    : contacts; // Show all contacts when search is empty
    

    useEffect(() => {
        try {
            fetch(import.meta.env.VITE_BACKEND_URL+"/contacts", {
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

        } catch (err) {
            console.log("Error fetching contacts", err);
        }
    }, [socket]);

    console.log("contactlist compo activeuser:",activeUsers);
    console.log("contactlist compo contacts:",contacts);


    // Helper function to extract first letter from contactName
    const getInitials = (name: string) => {
        const initials = name.split(" ").map((word: string) => word.charAt(0)).join("");
        return initials.toUpperCase();
    };

    return (
        <div className=" text-white p-6 h-full shadow-lg ">
            <h1 className="text-xl font-semibold text-center mb-2 text-gradient">
                Your Contacts
            </h1>
            <div className="mb-4 text-center text-sm text-gray-400 w-full flex justify-center items-center ">
                
                <input type="text" placeholder="Search Contact" value={searchContact} onChange={(e)=>{
                    handleSearchContact(e.target.value);
                }}

                className="w-3/4 text-md text-white bg-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#814bff] hover:border-[#814bff] transition duration-300 rounded-md p-2 mx-3"/>

                {/* Search Contact btn */}
                <button  className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#814bff] to-[#411caf] text-white rounded-full hover:bg-[#814bff] transition duration-300 text-lg cursor-pointer">
                    <FaSearch className="text-sm"/>
                </button>
            </div>
            <div className="space-y-4">
                {
                filteredContacts.map((contact: any, index: number) => (
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
