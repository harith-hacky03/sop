const express=require('express')
const app=express()
const {Server}=require('socket.io')
const v4=require('uuid').v4
const http=require('http')
const server=http.createServer(app)



const io=new Server(server,{
    cors:{
        origin:'*',
        methods:["GET","POST"]
    }
})

var rooms=[]

io.on("connection",(socket)=>{
    //console.log(socket.id)

    socket.on('create-room',(data)=>{
       const roomId=v4()
       socket.emit('room-created',roomId)
       //console.log(roomId)
        socket.join(roomId)
        rooms[roomId]=[]
        //console.log(rooms)
    })

    socket.on('join-room',(data)=>{
        socket.join(data.room)
        //console.log("User joined ",data.room,"with Peer",data.peerId)
        rooms[data.room].push(data.peerId)
        //console.log(rooms)
        socket.to(data.room).emit('room-members',rooms[data.room])

        socket.to(data.room).emit('user-joined',data.peerId)
    })
})


server.listen(5000,()=>console.log('Server listening on port 5000'))
