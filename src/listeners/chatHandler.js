import MessagesManagerMongo from "../dao/mongo/Managers/MessagesManagerMongo.js";

const messagesService = new MessagesManagerMongo();

const registerChatHandler = (io,socket) => {

    const saveMessage = async (message) =>{
        await messagesService.createMessages(message);
        const messageLogs = await messagesService.getMessages();
        io.emit('chat:messageLogs',messageLogs);
    }

    const newParticipant = (user) =>{
        socket.broadcast.emit('chat:newConnection',user)
    }

    socket.on('chat:message',saveMessage);
    socket.on('chat:newParticipant',newParticipant);

}

export default registerChatHandler;