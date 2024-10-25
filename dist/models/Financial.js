"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    users: {
        user: String,
        partner: String,
    },
    event: String,
    service: {
        service: String,
        description: String,
    },
    value: Number,
    status: {
        user: String,
        partner: String
    },
    payment: {
        paymentMethod: String,
        charge: String,
        order: String,
    },
    created: Date
});
var modelName = 'Financial';
exports.default = (mongoose_1.connection && mongoose_1.connection.models[modelName]) ?
    mongoose_1.connection.models[modelName]
    :
        (0, mongoose_1.model)(modelName, schema);
