const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(cors());
const myDbSchema = new mongoose.Schema({
    full_name: String,
    email: String,
    number: Number,
    city: String,
    url: String
});

const mockDB1 = mongoose.model("mockdata1", myDbSchema);

app.get("/", async (req, res, next) => {
    try {
        const data = await mockDB1.aggregate([
            {
                $lookup:
                {
                    from: "mockdata2",
                    localField: "email",
                    foreignField: "email",
                    as: "final"
                }
            }
        ])
        res.send(data)
    } catch (err) {
        res.send(err)
    }
})

app.listen(process.env.PORT || 8000, (err) => {
    connectdb();
    if (!err) {
        console.log("Server Started");
    } else {
        console.log("error", err);
    }
});

async function connectdb() {
    try {
        await mongoose.connect("mongodb://localhost:27017/interview");
    } catch (error) {
        console.log(error);
    }
}
