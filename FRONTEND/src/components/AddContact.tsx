import { useState } from "react";
import { toast } from "react-toastify";
import {socket} from "../socket";
interface AddContactProps {
    setContacts: React.Dispatch<React.SetStateAction<any[]>>;
    user: any;
    // socket: any;
}

const AddContact = ({ setContacts,user }: AddContactProps) => {
    const [contactUsername,setContactUsername]=useState<string>("");//store the contact to be added

    const handleAddContact=()=>{
        //if the contact username is same as the user's username then show an error ,a try to add a itself
        if(contactUsername===user){
            // console.log("You cannot add yourself as a contact");
            toast.error("Cannot add yourself as a contact",{position:"top-center",autoClose:3000});
            setContactUsername("");
            return;
        }
        
        fetch("http://localhost:3000/addContact",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            credentials:"include",//send the cookies to the server
            body:JSON.stringify({contact_username:contactUsername}),
        }).then((res)=>res.json()).then((data)=>{
            console.log("Add Contact Response",data);
            if(data.found && data.message==="Contact added successfully"){
                toast.success("Contact Added Successfully",{position:"top-center",autoClose:3000});
                setContacts((prevContacts: any[]) =>[...prevContacts,data.contacts]);//update the contacts array with the new contact os that sender can see the contact in the contacts list after adding the contact but the receiver will see the contact in the contacts list only after refreshing the page to fix we emit an event to the server to update the contacts list of the receiver
                // setInterval(()=>{
                //     console.log("Contacts",contacts);
                // },2000)

                socket.emit("addedContact",{contact:data.contacts});//emit an event to the server to update the contacts list of the receiver as it should show sender's username in contactlist
            }
            else if(data.found && data.message==="Contact already added"){
                toast.error("Contact already added",{position:"top-center",autoClose:3000});
            }
            else{
                toast.error("User not found",{position:"top-center",autoClose:3000});
            }

            setContactUsername("");//clear the input field
        })
    }

    const handleKeyDown=(ev:React.KeyboardEvent<HTMLInputElement>)=>{
        if(ev.key==="Enter"){
            handleAddContact();
        }
    }

    return (
        <div className="bg-gray-900 p-4 border-b-3  border-[#814bff] shadow-lg max-w-full">

            <div className="text-lg font-semibold text-center mb-4">
                {
                    (new Date().getHours()>=0 && new Date().getHours()<12) ? (
                        <h1 className="text-xl font-semibold text-white mb-2 text-center">
                            Good Morning, <i className="text-[#814bff]">{user}</i>
                        </h1>
                    ) : (new Date().getHours()>=12 && new Date().getHours()<17) ? (
                        <h1 className="text-xl font-semibold text-white mb-2 text-center">
                            Good Afternoon, <i className="text-[#814bff]">{user}</i>
                        </h1>
                    ) : (
                        <h1 className="text-xl font-semibold text-white mb-2 text-center">
                            Good Evening, <i className="text-[#814bff]">{user}</i>
                        </h1>
                    )
                }
            </div>

            <h2 className="text-lg font-semibold text-white mb-2 text-center">
                Add Contact
            </h2>
            <div className="flex items-center justify-center space-x-3">
                
                <input
                    type="text"
                    placeholder="Add your friend's username"
                    value={contactUsername}
                    onKeyDown={handleKeyDown}
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