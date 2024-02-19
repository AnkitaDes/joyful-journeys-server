require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const memoryRoutes = require("./src/routes/memory-routes");
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// basic home route
app.use("/memories", memoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
