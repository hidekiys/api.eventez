"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    partnerId: String,
    writer: String,
    text: {
        title: String,
        description: String
    },
    rate: Number,
    createdAt: { type: Date, default: function () { return Date.now() - 3 * 60 * 60 * 1000; } }
});
var modelName = 'Reviews';
exports.default = (mongoose_1.connection && mongoose_1.connection.models[modelName]) ?
    mongoose_1.connection.models[modelName]
    :
        (0, mongoose_1.model)(modelName, schema);
