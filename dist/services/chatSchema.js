"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zChatSchema = void 0;
var zod_1 = __importDefault(require("zod"));
exports.zChatSchema = zod_1.default.object({
    message: zod_1.default.object({
        text: zod_1.default.string(),
    }),
    users: zod_1.default.array(zod_1.default.string()),
    sender: zod_1.default.string(),
});
