const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');

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
});

app.get('/data', function(req, res) {
    res.sendFile('final.html', {root: __dirname })
});


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
        await mongoose.connect("mongodb+srv://admin:qwerty123@cluster0.0jvru.mongodb.net/interview?retryWrites=true&w=majority");
    } catch (error) {
        console.log(error);
    }
}
