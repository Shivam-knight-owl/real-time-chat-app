import { useEffect } from "react";

interface ContactListProps {
    onSelectingContact: (contact: any) => void;
    setContacts: (contacts: any[] | ((prevContacts: any[]) => any[])) => void;
    contacts: any[];
    // socket: any;
}
import {socket} from "../socket";

const ContactList = ({ onSelectingContact, setContacts,contacts }: ContactListProps) => { 
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
                // setTimeout(()=>{
                    //     console.log("Contacts",contacts);
                    // },5000) // update the contacts array with the fetched contacts
            });

            // listen for "addContact" event from the server to update the contacts list of the receiver when the sender adds a contact
            console.log("Socket", socket);
            socket.on("addedContact", (data: any) => {
            // console.log("Contact added", contacts);
            console.log("Contact added", data.sender);
            setContacts((prevContacts) => [...prevContacts, data.sender]); // Use functional form to update the contacts array with the new contact
        });                
        
            
        } catch (err) {
            console.log("Error fetching contacts", err);
        }
    }, [socket]);

    // Delete User Account
    // const handleDeleteUser=()=>{
    //     fetch("http://localhost:3000/deleteUser",{
    //         method:"DELETE",
    //         headers:{
    //             "Content-Type":"application/json",
    //         },
    //         credentials:"include",//send the cookies to the server
    //     }).then((res)=>res.json()).then((data)=>{
    //         console.log("Delete User Response",data);
    //         if(data.message==="User deleted successfully"){
    //             toast.success("User Deleted Successfully",{position:"top-center",autoClose:3000});
    //             window.location.href="/signin";//redirect to login page
    //         }
    //     })
    // }

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
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete User Account btn */}
            {/* <div className="flex justify-center mt-10 ">
                <button className="bg-gradient-to-r from-[#814bff] to-[#411caf] text-white px-4 py-2 rounded-md shadow-md  hover:scale-105  transition duration-300 cursor-pointer" onClick={handleDeleteUser}>
                    Delete Account
                </button>
            </div> */}
        </div>
    );
};

export default ContactList;
