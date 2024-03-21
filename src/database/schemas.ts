import mongoose from "mongoose";

const users = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true,
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
        type: String,
        default: "0"
    },

    joinedAt: {
        type: Date,
        default: () => new Date().setHours(new Date().getHours())
    },

    isBanned: {
        type: Boolean,
        default: false
    }
});

export const MUser = mongoose.model("users", users);