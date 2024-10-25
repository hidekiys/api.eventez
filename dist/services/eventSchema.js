"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zEventShema = void 0;
var zod_1 = __importDefault(require("zod"));
exports.zEventShema = zod_1.default.object({
    name: zod_1.default.string({ required_error: 'Preencha o nome corretamente!' }).min(2, 'O nome do evento precisa ter no mínimo 2 caracteres').max(30, 'O nome deve ter no máximo 30 caracteres').optional(),
    types: zod_1.default.array(zod_1.default.string()).optional(),
    status: zod_1.default.string().optional(),
    publicOfEvent: zod_1.default.array(zod_1.default.string()).optional(),
    place: zod_1.default.object({
        placeName: zod_1.default.string({ required_error: 'Preencha o nome do local!' }).min(2, 'Insira o nome do local'),
        cep: zod_1.default.string().length(8, 'O CEP inserido está incorreto'),
        street: zod_1.default.string(),
        neighborhood: zod_1.default.string({ required_error: 'Preencha o bairro' }),
        state: zod_1.default.string({ required_error: 'Preencha o estado' }).length(2),
        city: zod_1.default.string({ required_error: 'Preencha a cidade' }),
        number: zod_1.default.string({ required_error: 'Preencha o número' }),
        complement: zod_1.default.string().optional()
    }).optional(),
    date: zod_1.default.string({ required_error: 'Preencha a data!' }).date('Preencha a data corretamente!').optional(),
    hour: zod_1.default.string({ required_error: 'Preencha a hora' }).time('Preencha o horario corretamente!').optional(),
    endTime: zod_1.default.string({ required_error: 'Preencha a hora' }).time('Preencha o horario corretamente!').optional(),
    numberOfGuests: zod_1.default.number({ required_error: 'Preencha a quantidade de convidados!' }).gte(2, 'É preciso no mínimo dois convidados').optional(),
    parcialValue: zod_1.default.number().optional(),
    owner: zod_1.default.string().optional(),
    services: zod_1.default.array(zod_1.default.object({
        partnerId: zod_1.default.string(),
        services: zod_1.default.array(zod_1.default.string()),
        description: zod_1.default.string(),
        value: zod_1.default.number(),
    })).optional(),
    description: zod_1.default.string().min(2, 'A descrição deve conter no minimo dois caracteres!').optional(),
    todoList: zod_1.default.array(zod_1.default.object({
        status: zod_1.default.boolean(),
        todoItem: zod_1.default.number(),
        todoDescription: zod_1.default.string(),
    })).optional(),
    budgets: zod_1.default.array(zod_1.default.object({
        budgetItem: zod_1.default.number(),
        date: zod_1.default.string(),
        description: zod_1.default.string(),
        value: zod_1.default.number(),
        services: zod_1.default.array(zod_1.default.string()),
        event: zod_1.default.string(),
        status: zod_1.default.string(),
        partnerId: zod_1.default.string(),
    })).optional(),
    payments: zod_1.default.array(zod_1.default.object({
        date: zod_1.default.string(),
        value: zod_1.default.number(),
        service: zod_1.default.string(),
        description: zod_1.default.string(),
        status: zod_1.default.string(),
    })).optional(),
});
