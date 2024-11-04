"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zReviewSchema = void 0;
var zod_1 = __importDefault(require("zod"));
exports.zReviewSchema = zod_1.default.object({
    partnerId: zod_1.default.string(),
    writer: zod_1.default.string(),
    text: zod_1.default.object({
        title: zod_1.default.string(),
        description: zod_1.default.string()
    }),
    rate: zod_1.default.number(),
    createdAt: zod_1.default.date(),
});
