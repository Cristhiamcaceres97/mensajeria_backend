import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(cors());
app.use(express.json()); 


// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/usuarios', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
});

// Modelo de Usuario
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});
const User = mongoose.model('User', userSchema);

// Modelo de Mensaje
const messageSchema = new mongoose.Schema({
  sender: mongoose.Schema.Types.ObjectId,
  receiver: mongoose.Schema.Types.ObjectId,
  content: String,
});
const Message = mongoose.model('Message', messageSchema);

// Registrar nuevo usuario
app.post('/api/users', async (req, res) => {
  console.log('Registro de nuevo usuario:', req.body);
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener lista de usuarios
app.get('/api/users', async (req, res) => {
  console.log('Solicitud de lista de usuarios');
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Enviar mensaje
app.post('/api/messages', async (req, res) => {
  console.log('Envío de mensaje:', req.body);
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener mensajes relacionados con un usuario (tanto enviados como recibidos)
app.get('/api/messages/:userId', async (req, res) => {
  console.log(`Solicitud de mensajes para el usuario ${req.params.userId}`);
  try {
    // Buscar mensajes donde el usuario es el emisor o el receptor
    const messages = await Message.find({
      $or: [
        { sender: req.params.userId },
        { receiver: req.params.userId }
      ]
    }).populate('sender receiver').exec(); // Usar populate para obtener detalles del emisor y receptor
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/api/users/verify', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});














