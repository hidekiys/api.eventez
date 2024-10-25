"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    token: String
});
var modelName = 'Blacklist';
exports.default = (mongoose_1.connection && mongoose_1.connection.models[modelName]) ?
    mongoose_1.connection.models[modelName]
    :
        (0, mongoose_1.model)(modelName, schema);
