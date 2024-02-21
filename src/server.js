import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(cookieParser());

//routes import

import userRouter from "./routes/user.routes.js";
import memoriesRouter from "./routes/memory.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/memories", memoriesRouter);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export { app };
