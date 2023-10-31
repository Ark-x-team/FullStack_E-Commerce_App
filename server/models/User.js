const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        set: str => str.toLowerCase(),
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'manager'],
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    },
    last_login: {
        type: Number,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
    }
})

const User = mongoose.model('users', userSchema)

module.exports = User