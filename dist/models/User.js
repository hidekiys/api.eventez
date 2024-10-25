"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: String
    },
    password: { type: String, required: true },
    phone: String,
    email: { type: String, required: true },
    address: {
        cep: String,
        street: String,
        addressNumber: Number,
        neighborhood: String,
        state: String,
        city: String
    },
    document: Number,
    events: [],
    balance: Number,
    checked: Boolean,
    validation: String,
    alerts: [{
            date: String,
            description: String
        }],
    url_avatar: String,
    chats: [String],
    cards: [{
            brand: String,
            lastNumbers: String,
            token: String,
        }]
});
var modelName = 'User';
exports.default = (mongoose_1.connection && mongoose_1.connection.models[modelName]) ?
    mongoose_1.connection.models[modelName]
    :
        (0, mongoose_1.model)(modelName, schema);
