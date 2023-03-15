const mongoose = require('mongoose');
const DB = process.env.DATABASE;

const database = module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    try {
        mongoose.connect(DB, connectionParams);
        console.log("DataBase Connect");
    } catch (error) {
        console.log("Faild");
    }
};

database();
