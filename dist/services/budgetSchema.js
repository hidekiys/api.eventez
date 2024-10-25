"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zBudgetSchema = void 0;
var zod_1 = __importDefault(require("zod"));
exports.zBudgetSchema = zod_1.default.object({
    users: zod_1.default.object({
        user: zod_1.default.string(),
        partner: zod_1.default.string(),
    }),
    event: zod_1.default.string(),
    service: zod_1.default.object({
        services: zod_1.default.array(zod_1.default.string()),
        description: zod_1.default.string(),
    }),
    budgetDescription: zod_1.default.string(),
    value: zod_1.default.number(),
    status: zod_1.default.object({
        user: zod_1.default.string(),
        partner: zod_1.default.string()
    }),
    created: zod_1.default.date()
});
