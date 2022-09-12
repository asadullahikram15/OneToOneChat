import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Spinner,
  Text,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState,useEffect } from "react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import { useToast } from "@chakra-ui/toast";
import UpdateGroupChatModal from "./miscellaneous/UpdategroupChatModal";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client"



const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setaFetchAgain }) => {
  const { selectedChat, user, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);

  const toast = useToast();


  
  
  const fetchMessages = async () =>{
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      console.log(messages)
      setMessages(data);
      setLoading(false);

      socket.emit('join chat ',selectedChat._id)

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }


  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(true));
  },[])


  useEffect(()=>{
    fetchMessages();
    // selectedChatCompare = selectedChat;
  },[selectedChat])

  // useEffect(( ) => {
  //   socket.on("message recieved " ,(newMessageRecieved) => {
  //     if (  
  //       !selectedChatCompare ||
  //       selectedChatCompare._id !== newMessageRecieved.chat._id
  //       // give notification
  //    ) {
  //     } else {
  //       setMessages([...messages,newMessageRecieved]);
  //     }
  //   }) ;
  // });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        console.log(data)

        // socket.emit("new message" , data);
        // setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };



  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // typing indicator logic
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {getSender(user, selectedChat.users)}
            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
            {/* {!selectedChat.iGroupChat ? (
              <>
               {getSender(user, selectedChat.users)}
              <ProfileModal user={getSenderFull(user,selectedChat.users)}/> 
              </>
            ) : (
              <>
                  {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal fetchAgain={fetchAgain} setaFetchAgain={setaFetchAgain}/>
              </>
            )} */}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            height="90%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* {Message} */}
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages}/>
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3} id='first'>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message"
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
            {/* {Message} */}
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chating
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
