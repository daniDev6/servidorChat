const express=require('express')
const app=express()
const cors=require('cors')
const http=require('http')

const {Server}=require('socket.io')


app.use(cors())//petisiones cruzadas
const server=http.createServer(app)


//servidor socket para comunicacion en tiempo real
const io=new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
})
let usuarios=0
io.on('connection',socket=>{//informacion que esta llegando desde el front
    console.log('un cliente se ha conectado')
    console.log(`usuario actual: ${socket.id}`)

    usuarios+=1
    console.log(usuarios)
    socket.on("join_room",(data)=>{
        socket.join(data.room)//recibe el dato que envio el front desde join_room
        console.log(`un cliente se ha unido a la sala: ${data.username} en la sala ${data.room}`)
        //Obtener la lista de clientes en la sala
        
            
            const clientsInRoom = io.sockets.adapter.rooms.get(data.room);
            
            // Enviar la cantidad de usuarios en la sala de regreso al cliente
            const numberOfUsers = clientsInRoom.size;
            socket.to(data.room).emit("room_users_count", { room: data.room, usersCount: numberOfUsers });
    

        
    })
    socket.emit('perso_conect',usuarios)
    socket.on("send_message",(data)=>{
        socket.to(data.room).emit("receive_message",data)
        //quiero que envie esta data a determinada sala
        console.log('enviando dato: '+data.message)
    })

    socket.on("disconnect",()=>{
        console.log('un cliente se ha desconectado',socket.id)
    })
})
















app.get('/',(req,res)=>{
    res.send('servidor andando correctamente')
})





server.listen(3001,()=>{
    console.log(`Servidor corriendo en el puerto http://localhost:3001`)
})




