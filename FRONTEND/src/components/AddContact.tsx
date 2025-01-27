import { useState } from "react";
import { toast } from "react-toastify";

interface AddContactProps {
    setContacts: React.Dispatch<React.SetStateAction<any[]>>;
}

const AddContact = ({ setContacts }: AddContactProps) => {
    const [contactUsername,setContactUsername]=useState<string>("");//store the contact to be added

    const handleAddContact=()=>{
        fetch("http://localhost:3000/addContact",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            credentials:"include",//send the cookies to the server
            body:JSON.stringify({contact_username:contactUsername}),
        }).then((res)=>res.json()).then((data)=>{
            console.log("Add Contact Response",data);
            if(data.found){
                toast.success("Contact Added Successfully",{position:"top-center",autoClose:3000});
                setContacts((prevContacts: any[]) =>[...prevContacts,data.contacts]);//update the contacts array with the new contact
            }
            else{
                toast.error("User not found",{position:"top-center",autoClose:3000});
            }

            //for real time updation of contacts we set the contacts array with the updated contacts array

            setContactUsername("");//clear the input field
        })
    }

    return (
        <div className="bg-gray-900 p-4 border-b-3  border-[#814bff] shadow-lg max-w-full">
            <h2 className="text-lg font-semibold text-white mb-2 text-center">
                Add Contact
            </h2>
            <div className="flex items-center justify-center space-x-3">
                {/* Shortened input field */}
                <input
                    type="text"
                    placeholder="Add your friend's username"
                    value={contactUsername}
                    onChange={(ev) => setContactUsername(ev.target.value)}
                    className="w-3/4 p-2 text-md text-white bg-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#814bff] hover:border-[#814bff] transition duration-300 rounded-lg"
                />
                {/* Rounded and bigger "+" button */}
                <button
                    onClick={handleAddContact}
                    className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#814bff] to-[#411caf] text-white rounded-full hover:bg-[#814bff] transition duration-300 text-lg cursor-pointer"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default AddContact;