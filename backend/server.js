const express = require ("express") ;
// var cors = require('cors')
const connectDB = require("./config/db");
const { chats } = require("./data/data");
const dotenv = require("dotenv")
const colors = require('colors')
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const {notFound,errorHandler} = require("./middleware/errorMiddleware");
const { Socket } = require("socket.io");

dotenv.config();
connectDB()

const app = express();
app.use(require('cors')())

app.use(express.json()) //to accept data json



// app.get("/",( req , res ) => {
//   res.send ( "API is Running " ) ;
// } ) ;
app.use("/api/user/",userRoutes)
app.use("/api/chat/",chatRoutes)
app.use("/api/message/",messageRoutes)

// app.use(cors())


// error middleware
app.use(notFound)
app.use(errorHandler)

// app.get("/api/chat" ,( req,res ) => {
//   res.send (chats) ;
// }) ;

const PORT = process.env.PORT || 6000;

const server = app.listen (6000 ,console.log (`Server Started on PORT ${PORT}`.yellow.bold)) ;

const io = require('socket.io')(server,{
    pingTimeout : 60000,
    cors:{
        origin : "http://localhost:3000",
    },
})

io.on("connection",(socket) =>{
    console.log("connected to socket.io");

    socket.on ("setup",(userData)=>{
        socket.join (userData._id); 
        console.log(userData._id); 
        socket.emit ("connected");
    } );

    socket.on ("join chat" , (room) =>{
        socket.join (room) ;
       console.log ("User Joined Room:" + room)
      }) ;

    //   socket.on("typing", (room) => socket.in(room).emit("typing"));
    //   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    
      // socket.on("new message", (newMessageRecieved) => {
      //   var chat = newMessageRecieved.chat;
    
        // if (!chat.users) return console.log("chat.users not defined");
    
        // chat.users.forEach((user) => {
        //   if (user._id == newMessageRecieved.sender._id) return;
    
        //   socket.in(user._id).emit("message recieved", newMessageRecieved);
        // });
      // });
    
    //   socket.off("setup", () => {
    //     console.log("USER DISCONNECTED");
    //     socket.leave(userData._id);
    //   });
                         
});


