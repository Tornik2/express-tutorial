const mongoose = require('mongoose')
//bcrypt = hash password
const bcrypt = require('bcryptjs')
//JWT
const jwt = require('jsonwebtoken')
//validator(for email in this case)
const validator = require('validator')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email'
        }
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
})

UserSchema.pre('save', async function (){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePasswords = async function(userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password)
    return isMatch
}



module.exports = mongoose.model('User', UserSchema)