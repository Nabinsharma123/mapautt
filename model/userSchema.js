const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose")
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    tokens: [
        {
            token: {
                type: String,
                require: true
            }
        }
    ]
})



//we are hashing the password

userSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// we are gnarating token
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id, email: this.email, name: this.name, address: this.address, }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

const User = mongoose.model('USER', userSchema);
module.exports = User;