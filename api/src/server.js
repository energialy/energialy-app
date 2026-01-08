const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes/index.js");
const { BASE_URL } = process.env;
const http = require("http");
const { Server: socketIo } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Define allowed origins
const allowedOrigins = [
  "https://energialy.vercel.app",           // Producción
  "https://dev.energialy.vercel.app",       // Desarrollo
  "https://dev-api-energialy.vercel.app",   // API Dev (para Socket.IO)
  "http://localhost:3000",                   // Local
  "https://localhost:3000"
];

// CORS origin checker function
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  optionsSuccessStatus: 200
};

const io = new socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    credentials: true,
  },
});

let userSockets = [];

io.on("connection", (socket) => {
  console.log("New user connected" + socket.id);

  socket.on("authenticate", (data) => {
    const { companyId } = data;

    if (companyId) {
      userSockets[companyId] = socket.id;
      console.log(`User ${companyId} connected with socket ID: ${socket.id}`);
      console.log(userSockets);
    } else {
      console.log("Authentication failed");
      socket.disconnect();
    }
  });

  socket.on("sendMessage", (messageSended) => {
    const { _message, _sender, _receiver } = messageSended;
    console.log("receicer", _receiver)
    console.log("usersocket",userSockets[_receiver]);
    userSockets[_receiver]
      ? io.to(userSockets[_receiver]).emit("message", messageSended)
      : console.log("Mensaje enviado - Usuario no conectado");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected socket:" + socket.id);
    userSockets = userSockets.filter(user => user.socketId !== socket.id);
  });
});

app.name = "API";

// CORS middleware with dynamic origin checking
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options("*", cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
//app.use(morgan("dev"));

// Define routes
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("Energialy API");
});

// Error catching middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = { app, server, io };
