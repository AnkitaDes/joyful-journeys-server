require("dotenv").config();
const express = require("express");
const app = express();

const PORT = process.env.PORT || 5050;

const memoryRoutes = require("./routes/memory-routes");
// basic home route
app.use("/memories", memoryRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
