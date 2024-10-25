"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zUserSchema = void 0;
var zod_1 = __importDefault(require("zod"));
exports.zUserSchema = zod_1.default.object({
    name: zod_1.default.object({
        firstName: zod_1.default.string({ required_error: 'Preencha o nome corretamente!' }).min(2, 'O nome deve ter no minimo duas letras.'),
        lastName: zod_1.default.string().min(2).optional()
    }),
    password: zod_1.default.string({ required_error: 'A senha deve ser preenchida' })
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/, 'A senha deve conter ao menos uma letra minúscula, uma maiúscula, um caratere especial e 8 caracteres'),
    phone: zod_1.default.string().length(11, 'Preencha o número corretamente').optional(),
    email: zod_1.default.string({ required_error: 'Preencha o campo email' }).email('Preencha o email corretamente').toLowerCase(),
    address: zod_1.default.object({
        cep: zod_1.default.string().length(8),
        street: zod_1.default.string(),
        addressNumber: zod_1.default.number(),
        neighborhood: zod_1.default.string(),
        state: zod_1.default.string().min(1).max(2),
        city: zod_1.default.string().min(2)
    }).optional(),
    document: zod_1.default.number().min(10).optional(),
    events: zod_1.default.array(zod_1.default.string()).optional(),
    balance: zod_1.default.number().optional(),
    checked: zod_1.default.boolean().default(false),
    validation: zod_1.default.string().optional(),
    alerts: zod_1.default.array(zod_1.default.object({
        date: zod_1.default.string().datetime(),
        description: zod_1.default.string()
    })).optional(),
    url_avatar: zod_1.default.string().optional(),
    chats: zod_1.default.array(zod_1.default.string()).optional(),
    cards: zod_1.default.array(zod_1.default.object({
        brand: zod_1.default.string(),
        lastNumbers: zod_1.default.string(),
        token: zod_1.default.string(),
    })).optional()
});
