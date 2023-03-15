const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const express = require('express');
const app = express();
const mongoose = require("mongoose");
var cors = require('cors');
const bcrypt = require('bcryptjs');
app.use(cors())
const router = express.Router();
dotenv.config({ path: './config.env' });
// DATABASE ROUTE
require('./db/conn');

app.use(express.json());
const User = require('./model/userSchema');
const conn = require("./db/conn");

app.get('/get', async (req, res) => {
    const data = await User.find();
    res.json(data);
})

// register 
app.post('/register', async (req, res) => {
    const { name, email, password, address } = req.body;

    // console.log(name);
    // console.log(email);
    // console.log(req.body.name);
    // res.send("Mere register page");
    // res.json({ message: req.body });

    if (!name || !email || !password || !address) {
        return res.status(422).json({ error: "plz filled the field properly" })
    }

    try {
        const userExist = await User.findOne({ email: email })

        if (userExist) {
            return res.status(422).json({ error: "Email already Exist" });
        } else {
            const user = new User({ name, email, password, address });
            const userRegister = await user.save();
            if (userRegister) {
                res.status(200).json({ status: true, success: "User Register successfully" });
            } else {
                res.status(500).json({ error: "Failed to registered" });
            }
        }

    } catch (err) {
        console.log(err);
    }


});

// loogin 

app.post('/signin', async (req, res) => {
    // res.send('Hello register the server')
    // console.log(req.body);
    // res.json({ message: "awesome" });

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "plz filled the data" })
        }

        const userLogin = await User.findOne({ email: email });
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();

            console.log(token);

            if (!isMatch) {
                res.status(400).json({ message: "user error" });
            } else {
                res.json({ status: true, token: token });
            }

        } else {
            res.status(400).json({ message: "user error" });
        }

        //register all data print
        // console.log(userLogin);

    } catch (error) {
        console.log(error);
    }
});

app.listen(process.env.PORT || 8000, () => {
    console.log("server is running at port no 8000");
});
module.exports = router;