import express from 'express';
import {Server} from "socket.io";
import {createServer} from "http"
import cors from "cors";
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const port =3000;

const app = express();
const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        method:["GET","POST"],
        credentials:true,
    }
});

app.use(cors({
    origin:"http://localhost:5173",
    method:["GET","POST"],
    credentials:true,
}))

const secretkeyJWT = "Debasish"

app.get("/", (req, res) => {
    res.send("Hello world!")
})


app.get("/login", (req, res) => {
   const token = jwt.sign({_id: "Deba"},secretkeyJWT)

   res.cookie("token", token,{httpOnly:false,secure:true, sameSite:"none"}).json({
    message:"Login Success",
   })
})

const user=false;
io.use((socket,next)=>{
    cookieParser()(socket.request, socket.request.res,(error)=>{
        if(error) return next(error);
        const token = socket.request.cookies.token;

        if(!token) return next(new Error("Authentication Error"));
        const decode = jwt.verify(token, secretkeyJWT)
        next()
    } )
})

io.on("connection",(socket)=>{
    console.log("User connected")
    console.log("Id",socket.id);

    socket.on("message",(data)=>{
        console.log(data)
        io.to(data.room).emit("recieve-message", data)
    })

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User joined ${room}`);
    });


    // socket.on("disconnect",()=>{
    //     console.log("User disconnected",socket.id)
    // })
    // socket.broadcast.emit("welcome",`welcome to the server, ${socket.id}`)
})

server.listen(port, () => {
    console.log(`Server is running at ${port}`);
})
