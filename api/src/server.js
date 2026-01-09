const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server: SocketIOServer } = require("socket.io");

const routes = require("./routes/index.js");

const app = express();
const server = http.createServer(app);

/* =====================================================
   CORS CONFIGURATION
===================================================== */

const allowedOrigins = [
  "https://energialy.vercel.app",
  "https://dev.energialy.vercel.app",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requests sin origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

/* =====================================================
   MIDDLEWARES
===================================================== */

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());

/* =====================================================
   SOCKET.IO CONFIGURATION
===================================================== */

const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

let userSockets = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("authenticate", ({ companyId }) => {
    if (!companyId) {
      socket.disconnect();
      return;
    }

    userSockets[companyId] = socket.id;
    console.log(`Company ${companyId} connected with socket ${socket.id}`);
  });

  socket.on("sendMessage", (message) => {
    const { _receiver } = message;
    const receiverSocket = userSockets[_receiver];

    if (receiverSocket) {
      io.to(receiverSocket).emit("message", message);
    } else {
      console.log("User not connected:", _receiver);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);

    for (const key in userSockets) {
      if (userSockets[key] === socket.id) {
        delete userSockets[key];
      }
    }
  });
});

/* =====================================================
   ROUTES
===================================================== */

app.use("/", routes);

app.get("/", (_, res) => {
  res.send("Energialy API");
});

/* =====================================================
   ERROR HANDLER
===================================================== */

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal server error" });
});

module.exports = { app, server, io };
