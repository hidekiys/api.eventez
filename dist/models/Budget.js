"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    users: {
        user: String,
        partner: String,
    },
    event: String,
    service: {
        services: [String],
        description: String,
    },
    budgetDescription: String,
    value: Number,
    status: {
        user: String,
        partner: String
    },
    created: Date
});
var modelName = 'Budget';
exports.default = (mongoose_1.connection && mongoose_1.connection.models[modelName]) ?
    mongoose_1.connection.models[modelName]
    :
        (0, mongoose_1.model)(modelName, schema);
