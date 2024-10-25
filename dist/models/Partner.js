"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    document: String,
    name: String,
    banner: String,
    url_avatar: String,
    email: String,
    password: String,
    types: [String],
    about: String,
    local: {
        cep: String,
        street: String,
        neighborhood: String,
        state: String,
        city: String,
        complement: String,
        number: Number
    },
    offerServices: [{
            name: String,
            description: String,
            averagePrice: Number,
        }],
    budgets: [{
            budgetItem: Number,
            eventName: String,
            eventNumberOfGuests: Number,
            userName: String,
            description: String,
            date: String,
            user: String,
            services: [String],
            value: Number,
            event: String,
            status: String,
        }],
    notifications: [{
            type: String,
            data: String,
            hora: String,
            description: String,
            event: String,
            sender: String
        }],
    receipts: [{
            date: String,
            value: Number,
            event: String,
            user: String,
            status: String,
        }],
    services: [{
            name: String,
            description: String,
            averagePrice: Number,
        }],
    questions: [{
            ask: String,
            response: String,
        }],
    images: [String],
    rate: Number,
    reviews: [{
            user: String,
            title: String,
            score: Number,
            description: String,
            images: [String],
        }],
    chats: [String]
});
var modelName = 'Partner';
exports.default = (mongoose_1.connection && mongoose_1.connection.models[modelName]) ?
    mongoose_1.connection.models[modelName]
    :
        (0, mongoose_1.model)(modelName, schema);
