const express = require("express");
const process = require("process");
const app = express();
require("dotenv").config(); // It exports .env files
require("express-async-errors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const authRouter = require("./routes/auth-routes");
const avatarRouter = require("./routes/avatar-routes");
const userRouter = require("./routes/user-routes");
const accessRouter = require("./routes/profile_access");
const authMiddleware = require("./middleware/auth-middleware");
const connnectDB = require("./db/connect");
const jobRouter = require("./routes/jobs-routes");
const messageRouter = require("./routes/messages-route");
const fileUpload = require("express-fileupload");
const { isTokenValid } = require("./utils/jwt");
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
app.locals.io = io;
module.exports = io;
const setupSwagger = require('./utils/swaggerConfig');
const resumeCtrl = require("./routes/resume-routes");


//Middleware
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windows
  })
);

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(express.static("./public"));

// Apply authMiddleware for Socket.IO
io.use(async (socket, next) => {
  const token = socket.request.cookies.token;
  console.log(token);
  if (!token) {
    return next(new Error("Authentication error: Token missing"));
  }

  try {
    // Verify the token and extract user information
    const user = isTokenValid({ token });

    // Attach the user information to the socket for use in other handlers
    socket.user = user;
    console.log(
      "The user was passed from WebSocket auth middleware successfully!"
    );
    return next();
  } catch (error) {
    return next(new Error("Authentication error: Invalid token"));
  }
});
io.on("connection", (socket) => {
  console.log("The user connected");

  socket.on("disconnect", () => {
    console.log("The user disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("<h1>Jobs API</h1>");
});


//routes
// app.use("/api/v1/jobs", jobRouter);

app.post("/test", (req, res) => {
  console.log("req-user: ", req.user);
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMiddleware, jobRouter);
app.use("/api/v1/users", userRouter); // removed authMiddleware for a while
app.use("/api/v1/users/avatar", authMiddleware, avatarRouter); // removed authMiddleware for a while
app.use("/api/v1/privacy", authMiddleware, accessRouter);
app.use("/api/v1/users/messaging", messageRouter);
app.use("/api/v1/users/resume", authMiddleware, resumeCtrl);
setupSwagger(app);


const port = process.env.PORT || 5001;

// connnection

const start = async () => {
  try {
    await connnectDB(process.env.MONGO_URI),
      app.listen(port, console.log(`it's listening ${port}  `));
  } catch (err) {
    console.log(err);
  }
};

start();
