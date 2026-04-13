require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes")); // ✅ ADD HERE


app.listen(process.env.PORT, () =>
  console.log("Server running on port", process.env.PORT)
);