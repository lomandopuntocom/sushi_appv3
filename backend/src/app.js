require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/blog", blogRoutes);

app.get("/api/health", (_req, res) => {
	res.json({ status: "ok" });
});

module.exports = app;
