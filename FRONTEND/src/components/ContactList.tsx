import { useEffect } from "react";

interface ContactListProps {
    onSelectingContact: (contact: any) => void;
    setContacts: (contacts: any[]) => void;
    contacts: any[];
}

const ContactList = ({ onSelectingContact,setContacts,contacts }: ContactListProps) => { 

    useEffect(()=>{
        try{
         
            fetch("http://localhost:3000/contacts",{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials:"include",//send the cookies to the server
                }).then((res)=>res.json()).then((data)=>{
                    console.log("Contacts fetched",data);
                    setContacts(data.contacts);//update the contacts array with the fetched contacts
            });
        }catch(err){
            console.log("Error fetching contacts",err);
        }
    },[]);

    // Helper function to extract first letter from contactName
    const getInitials = (name: string) => {
        const initials = name.split(" ").map((word: string) => word.charAt(0)).join("");
        return initials.toUpperCase();
    };

    return (
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 h-screen overflow-y-auto shadow-lg ">
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
        </div>
    );
};

export default ContactList;
