import express from 'express';
import {Server} from "socket.io";
import {createServer} from "http"
import cors from "cors";

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

app.get("/", (req, res) => {
    res.send("Hello world!")
})

io.on("connection",(socket)=>{
    console.log("User connected")
    console.log("Id",socket.id);

    socket.on("message",(data)=>{
        console.log(data)
        io.to(data.room).emit("recieve-message", data)
    })


    // socket.on("disconnect",()=>{
    //     console.log("User disconnected",socket.id)
    // })
    // socket.broadcast.emit("welcome",`welcome to the server, ${socket.id}`)
})

server.listen(port, () => {
    console.log(`Server is running at ${port}`);
})
