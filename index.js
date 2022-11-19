const express = require("express");
const credentials = require("./middleware/credentials");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const { ioCorsOption, corsOption } = require("./config/corsOption");
const meetingController = require("./controller/socket/meeting");

require("./config/passport");

const app = express();
const server = require("http").createServer(app);
const PORT = process.env.PORT || 5000;

app.use(credentials);
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use("/auth", require("./api/authApi"));

const io = new Server(server, {
  cors: ioCorsOption,
});

io.on("connection", (socket) => {
  meetingController(socket);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
