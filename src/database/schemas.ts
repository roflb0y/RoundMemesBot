import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    userId: {
        type: Number,
        default: 0
    },

    username: {
        type: String,
        default: ""
    },

    locale: {
        type: String,
        default: "ru"
    },

    processesCount: {
        type: Number,
        default: 0
    },

    convertType: {
        type: Number,
        default: 0
    },

    joinedAt: {
        type: Date,
        default: () => new Date()
    },

    isBanned: {
        type: Boolean,
        default: false
    }
});

const processesSchema = new mongoose.Schema({
    user: {
        type: Number,
        required: true
    },

    convertType: {
        type: Number,
        required: true
    },

    processTime: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        required: true,
        default: () => new Date()
    }
});

export const User = mongoose.model("users", usersSchema);
export const Process = mongoose.model("processes", processesSchema);