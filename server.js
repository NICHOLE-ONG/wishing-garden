const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

require("dotenv").config({ path: "./config.env" });

const app = express();

// db connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

connectDB();

// middleware
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "client")));

// routes
const wishRoutes = require("./routes/wishRoutes");
const pageRoutes = require("./routes/pageRoutes")

// api endpoints + mounting routes
app.use("/", pageRoutes);
app.use("/api/wishes", wishRoutes);

app.get("/", (req, res) => {
    res.render("garden");
});

// start server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});