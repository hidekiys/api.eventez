"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zNotificationSchema = void 0;
var zod_1 = __importDefault(require("zod"));
exports.zNotificationSchema = zod_1.default.object({
    notificationType: zod_1.default.string(),
    users: zod_1.default.object({
        sender: zod_1.default.string(),
        receiver: zod_1.default.string(),
    }),
    event: zod_1.default.string(),
    created: zod_1.default.date()
});
