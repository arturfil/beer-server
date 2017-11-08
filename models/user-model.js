const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    fullName: {
        type: String,
        required: [ true, "We need a name"]
    },
    username: {
        type: String,
        required: [true, "Username is required"]
    },
    encryptedPassword: {
        type: String,
        required: [true, "Password is required"]
    }
},
{
    timestamps: true
}
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;