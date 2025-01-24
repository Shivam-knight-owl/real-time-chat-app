import {BrowserRouter as Router, Routes,Route, useNavigate} from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Chat from './pages/Chat';
import Navbar from './components/Navbar';

//for pop-up alerts in better way we use toastify library:
// Importing toastify module
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';

function App() {
    return (
      <Router>
        {/* this is introduced as useNavigate() hook cant be used outside <Router> */}
        <AppContent /> 
        <ToastContainer />
      </Router>
      
    );
  }
  
  function AppContent() {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      try {
        fetch("http://localhost:3000/logout", {
          method: "POST",
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            // alert(data.message);//better will be to use a toast library as alert is blocking.
            if(data[1].alreadyLoggedOut){
              toast.info(data[0].message,{position: "top-center",autoClose: 3000});
            }
            else{
              toast.success(data[0].message,{position: "top-center",autoClose: 3000});
            }
            //redirect to the signin page
            navigate("/signin");
          });
      } catch (err) {
        console.error("Error logging out:", err);
      }
    };
  
    return (
      <>
        <Navbar handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </>
    );
  }

export default App;

//firstly written all frontend here only

// import { useEffect, useRef, useState } from 'react';
// import './App.css'
// import { io, Socket } from 'socket.io-client';

// const socket= useRef<Socket>() 
//   const [username,setUsername]=useState('');//username for signup
//   const [password,setPassword]=useState('');//password of the logged in user
//   const [name,setName]=useState('');//name of the logged in user
//   const [email,setEmail]=useState('');//email of the logged in user
//   const [contactUsername,setContactUsername]=useState('');
//   const [message,setMessage]=useState('');//text of the message
//   // const [reciever,setReciever]=useState('');
//   const [messages,setMessages]=useState<String[]>([]);
//   const [user,setUser]=useState<any>(null);
//   const [contacts,setContacts]=useState<any>([]);
//   const [currentChat,setCurrentChat]=useState<any>(null);


//   useEffect(()=>{
//     socket.current = io("http://localhost:3000",{
//       withCredentials:true, //socket.io automatically sends the cookies along with the request
//       transports:["websocket"] 
//     })
//     socket.current.on('connect',()=>{
//       console.log('connected');
//     })
//     socket.current.on("message",(msg)=>{//socket on client listening for message event from the socket.io server
//       console.log("Real time message received:",msg);
//       setMessages(prevMessages => [...prevMessages, msg]); // Use functional form to update state and add the new message to the messages array
//     })

//     //fetch the logged in user's info
//     fetch("http://localhost:3000/me",{
//       method:"GET",
//       credentials:"include" //send the cookies along with the request
//     }).then(res=>res.json()).then(data=>{
//       if(data.user){
//         console.log(data.user);
//         setUser(data.user.username);//set the user state to the logged in user's info
//       }
//     });

//     //fetch all contacts of the logged in user
//     fetch("http://localhost:3000/contacts",{
//       method:"GET",
//       credentials:"include"
//     }).then(res=>res.json()).then(data=>{
//       console.log(data);
//       setContacts(()=>[...data.contacts]);
//     });

//     //fetch all messages of the logged in user
    
//   },[]);//empty arr as second arg means this effect will only run once when it first mounts

// return(
// <>
// <div>
//         <p>Welcome,{user}</p>
//       </div>

//       {/* Reciever's Username
//       <input type="text" placeholder="Reciever's Username" value={reciever} onChange={(ev)=>{
//         setReciever(ev.target.value);
//       }} /> */}
      
//       {/* Message inputbox */}
//       <input type="text" placeholder="Type your message" value={message} onChange={(ev)=>{
//         setMessage(ev.target.value)
//       }}/>

//       {/* Send Msg button */}
//       <button 
//         onClick={()=>{
//           //1.save the message in the db using the sendMessage route in the backend
//           fetch("http://localhost:3000/sendMessage",{
//             method:"POST",
//             headers:{
//               "Content-Type":"application/json"
//             },
//             credentials:"include",
//             body:JSON.stringify({receiver:currentChat.contactName,msg:message})
//           }).then(res=>res.json()).then(data=>{
//             console.log(data);
//           })
//           //2.emit the message to the socket.io server
//           socket.current?.emit('message',{receiver:currentChat.contactuserId,msg:message});//? is used so that if socket.current is null, it will not throw an error
//           setMessage("");//clear the message input box
//         }}>
//         Send Message
//       </button>
      
//       {/* signup  */}
//       <input type="text" placeholder="username" value={username} onChange={(ev)=>{
//         setUsername(ev.target.value);
//       }}></input>
//       <input type="text" placeholder="password" value={password} onChange={(ev)=>{
//         setPassword(ev.target.value);
//       }}></input>
//       <input type="text" placeholder="name" value={name} onChange={(ev)=>{
//         setName(ev.target.value);
//       }}></input>
//       <input type="text" placeholder="email" value={email} onChange={(ev)=>{
//         setEmail(ev.target.value);
//       }}></input>

//       <button onClick={()=>{
//         fetch("http://localhost:3000/signup",{
//           method:"POST",
//           headers:{
//             "Content-Type":"application/json"
//           },
//           credentials:"include",//what is does is that it sends the cookies along with the request
//           body:JSON.stringify({username:username,password:password,email:password,name:name})
//         }).then(res=>res.json()).then(data=>{
//           console.log(data);
//         })
//       }}>
//         signup
//       </button>

//       {/* signin */}
//       <input type="text" placeholder="username-signin" value={username} onChange={(ev)=>{
//         setUsername(ev.target.value);
//       }}></input>
//       <input type="text" placeholder="password-signin" value={password} onChange={(ev)=>{
//         setPassword(ev.target.value);
//       }}></input>

//       <button onClick={()=>{
//         fetch("http://localhost:3000/signin",{
//           method:"POST",
//           headers:{
//             "Content-Type":"application/json"
//           },
//           credentials:"include",
//           body:JSON.stringify({username:username,password:password})
//         }).then(res=>res.json()).then(data=>{
//           console.log(data);
//         })
//       }}>
//         signin
//       </button>

//       {/* logout */}
//       <button onClick={()=>{
//         fetch("http://localhost:3000/logout",{
//           method:"POST",
//           credentials:"include"
//         }).then(res=>res.json()).then(data=>{
//           console.log(data);
//         })
//       }}>
//         logout
//       </button>

//       {/* Add Contact/friend button */}
//       <input type="text" placeholder="Add Contact Username" value={contactUsername} onChange={(ev)=>{
//         setContactUsername(ev.target.value);
//       }}></input>

//       <button onClick={()=>{
//         fetch("http://localhost:3000/addContact",{
//           method:"POST",
//           headers:{
//             "Content-Type":"application/json"
//           },
//           credentials:"include",
//           body:JSON.stringify({contact_username:contactUsername})
//         }).then(res=>res.json()).then(data=>{
//           console.log(data);
//           setContacts([...contacts,data.contacts]);
//         })
//       }}>
//         Add Contact
//       </button>

//       {/* All messages */}
//       <div>
//         <h2>All Messages</h2>
//         {messages.map((msg,index)=>{
//           return <div key={index}>{msg}</div>
//         })}
//       </div>
//       <div>
//         <h2>Contacts</h2>
//         {contacts.map((contact:any,index:number)=>{
//           return <div key={index} onClick={()=>{
//             console.log("contactuser clicked",contact);
//             setCurrentChat(contact);// Set the current chat to the selected contact. This will be used to send messages to the selected contact
//             setMessages([]); // Clear the messages state before fetching new messages

//             // Fetch all messages for the selected contact
//             fetch(`http://localhost:3000/messages/${contact.contactName}`, {
//               method: "GET",
//               credentials: "include",
//             })
//               .then((res) => res.json())
//               .then((data) => {
//                 console.log("Fetched all messages:", data);
//                 if (data.messages) {
//                   setMessages(data.messages); // Set the messages fetched from the backend
//                 }
//               })
//               .catch((err) => console.error("Error fetching messages:", err));
//           }}>{contact.contactName}</div>
//         })}
//       </div>
// )
// </>