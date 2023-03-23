require('dotenv').config()
const cors = require("cors")
const express = require("express");
const mongoose = require('mongoose')
const http = require('http');
const socketIo = require('socket.io');
const chatRouter = require('./routers/chatRoute')
const patientRoute = require('./routers/patientRoute')

const app = express();

const server = http.Server(app);
const db = process.env.DATABASE
app.use(cors())
app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200).send("My Api is connected successfully")
})

app.use('/api', chatRouter);
app.use('/api', patientRoute)

mongoose.set('strictQuery', true)
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("MongooseDB connected")
}).then(()=>{
  app.listen(process.env.PORT, ()=>{
    console.log("Server is listening to PORT: 2929")
})
})

// Start the Socket.IO server and listen for incoming connections
const io = socketIo(server);
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for the 'send_message' event from clients
  socket.on('send_message', (data) => {
    console.log('Received message:', data);

    // Emit the 'new_message' event to all connected clients
    io.emit('new_message', data);
  });

  // Listen for the 'disconnect' event from clients
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// // Start the server
// const port = process.env.PORT || 3000;
// server.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });