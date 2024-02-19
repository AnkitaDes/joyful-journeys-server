import dotenv from "dotenv";
import express from "express";
import cors from "cors";
// import memoryRoutes from "./routes/memory-routes.js";

dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// basic home route
// app.use("/memories", memoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
