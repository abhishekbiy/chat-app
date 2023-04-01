const express = require('express');
const cors = require('cors');
const http = require('http');
const socket = require('socket.io');
const env = require('dotenv');
const { getLastMessagesFromRoom, setRoomMessagesByDate } = require('./Utils/Message.js');
const User = require('./Models/UserSchema.js');
const Message = require('./Models/MessageSchema.js');
const catchAsyncError = require('./Middlewares/CatchAsyncError.js');
const cookieParser = require('cookie-parser');

const app = express();

env.config()
app.use(cookieParser());
app.use(cors({
    origin:process.env.Frontend_URL,
    methods:["GET", "POST","DELETE" , "PUT"],
    credentials: true,
}));
app.use(express.json());

app.use(express.urlencoded({extended: true}));

// app.use("/", (req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", process.env.Frontend_URL);
//     res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//     next();
//   });

const server = http.createServer(app);

const io = socket(server , {
    cors:{
        credentials: true,
        origin:process.env.Frontend_URL,
        methods:["GET", "POST"],
    }
})


app.use("/user" , require("./Routes/UserRoutes"));

io.on("connection" , (socket)=>{
    //when user join
    socket.on("new-user", async()=>{
        const users = await User.find();
        io.emit("new-user", users)
    })

    //when user join room
    socket.on("join-room", async (room , previousRoom)=>{
        socket.join(room);
        socket.leave(previousRoom);
        let roomMessages = await getLastMessagesFromRoom(room);
            roomMessages = setRoomMessagesByDate(roomMessages);
            socket.emit("room-messages" , roomMessages);
    })

    //when user send msg in room
    socket.on('message-room', async (content , room ,sender , time ,date)=>{
        const newMessage = await Message.create({content, from :sender , to : room , time , date});
        let roomMessages = await getLastMessagesFromRoom(room);
            roomMessages = setRoomMessagesByDate(roomMessages);
            io.to(room).emit("room-messages" , roomMessages);
            socket.broadcast.emit('notifications', room);

    })

    //logout
    app.delete('/user/logout' , catchAsyncError(async (req , res) => {
        const {_id , newMessage} = req.body;
        res.cookie("chattoken","", {
            httpOnly: true,
            expires :new Date(
                Date.now()
            )})
        const user = await User.findById(_id);
        user.status = "offline"
        user.newMessage = newMessage;
        await user.save();
        const members = await User.find();
        socket.broadcast.emit("new-user" , members);
        
        res.status(200).json({});
    }))
    

})


app.use(require("./Middlewares/Errors"))
 

module.exports =server; 