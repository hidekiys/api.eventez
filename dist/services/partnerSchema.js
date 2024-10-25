"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = __importDefault(require("zod"));
var zPartnerSchema = zod_1.default.object({
    document: zod_1.default.string(),
    name: zod_1.default.string().min(2),
    types: zod_1.default.array(zod_1.default.string()),
    banner: zod_1.default.string(),
    email: zod_1.default.string(),
    password: zod_1.default.string(),
    url_avatar: zod_1.default.string(),
    about: zod_1.default.string(),
    local: zod_1.default.object({
        cep: zod_1.default.string().length(11),
        street: zod_1.default.string(),
        neighborhood: zod_1.default.string(),
        state: zod_1.default.string().length(2),
        city: zod_1.default.string(),
        number: zod_1.default.number(),
        complement: zod_1.default.string()
    }),
    offerServices: zod_1.default.array(zod_1.default.object({
        name: zod_1.default.string(),
        description: zod_1.default.string(),
        averagePrice: zod_1.default.number(),
    })),
    budgets: zod_1.default.array(zod_1.default.object({
        budgetItem: zod_1.default.number(),
        date: zod_1.default.string(),
        description: zod_1.default.string(),
        user: zod_1.default.string(),
        userName: zod_1.default.string(),
        eventName: zod_1.default.string(),
        eventNumberOfGuests: zod_1.default.number(),
        services: zod_1.default.array(zod_1.default.string()),
        value: zod_1.default.number(),
        event: zod_1.default.string(),
        status: zod_1.default.string(),
    })).optional(),
    notifications: zod_1.default.array(zod_1.default.object({
        type: zod_1.default.string(),
        data: zod_1.default.string(),
        hora: zod_1.default.string(),
        description: zod_1.default.string(),
        event: zod_1.default.string(),
        sender: zod_1.default.string()
    })).optional(),
    receipts: zod_1.default.array(zod_1.default.object({
        date: zod_1.default.string(),
        value: zod_1.default.number(),
        event: zod_1.default.string(),
        user: zod_1.default.string(),
        status: zod_1.default.string(),
    })).optional(),
    services: zod_1.default.array(zod_1.default.object({
        name: zod_1.default.string(),
        description: zod_1.default.string(),
        averagePrice: zod_1.default.number(),
    })).optional(),
    questions: zod_1.default.array(zod_1.default.object({
        ask: zod_1.default.string(),
        response: zod_1.default.string(),
    })).optional(),
    images: zod_1.default.array(zod_1.default.string()).optional(),
    rate: zod_1.default.number(),
    reviews: zod_1.default.array(zod_1.default.object({
        user: zod_1.default.string(),
        title: zod_1.default.string(),
        score: zod_1.default.number(),
        description: zod_1.default.string(),
        images: zod_1.default.array(zod_1.default.string()).optional(),
    })).optional(),
    chats: zod_1.default.array(zod_1.default.string()).optional()
});
