import { Box } from "@chakra-ui/layout";
import { ChatState } from "../context/ChatProvider";
import { useState } from "react";
import Chatbox from "../component/Chatbox";
import SideDrawer from "../component/miscellaneous/SideDrawer";
import MyChats from "../component/MyChats";

const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain , setFetchAgain] =  useState(false)

  return (
    <div style={{ width: "100%" }}>
    {user && <SideDrawer />}
    <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
      {user && <MyChats fetchAgain={fetchAgain}/>}
      {user && (
        <Chatbox  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
      )}
    </Box>

 {/* <SideDrawer />
    <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
      <MyChats />
       <Chatbox  />
      
    </Box> */}
  </div>
  );
};

export default Chat






