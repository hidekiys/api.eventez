"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    name: String,
    types: [String],
    publicOfEvent: [String],
    status: String,
    place: {
        placeName: String,
        cep: String,
        street: String,
        neighborhood: String,
        state: String,
        city: String,
        number: String,
        complement: String
    },
    date: String,
    hour: String,
    endTime: String,
    numberOfGuests: Number,
    parcialValue: Number,
    owner: String,
    services: [{
            partnerId: String,
            services: [String],
            description: String,
            value: Number,
        }],
    description: String,
    todoList: [{
            todoItem: Number,
            status: Boolean,
            todoDescription: String
        }],
    budgets: [{
            budgetItem: Number,
            date: String,
            description: String,
            value: Number,
            services: [String],
            event: String,
            status: String,
            partnerId: String
        }],
    payments: [{
            date: String,
            value: Number,
            service: String,
            description: String,
            status: String,
        }]
});
var modelName = 'Event';
exports.default = (mongoose_1.connection && mongoose_1.connection.models[modelName]) ?
    mongoose_1.connection.models[modelName]
    :
        (0, mongoose_1.model)(modelName, schema);
