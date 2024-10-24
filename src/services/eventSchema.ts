import z, { date, number } from 'zod'

export const zEventShema = z.object ({
    name: z.string({required_error: 'Preencha o nome corretamente!'}).min(2, 'O nome do evento precisa ter no mínimo 2 caracteres').max(30, 'O nome deve ter no máximo 30 caracteres').optional(),
    types: z.array(z.string()).optional(),
    status: z.string().optional(),
    publicOfEvent: z.array(z.string()).optional(),
    place: z.object({
        placeName: z.string({required_error: 'Preencha o nome do local!'}).min(2, 'Insira o nome do local'),
        cep: z.string().length(8, 'O CEP inserido está incorreto'),
        street: z.string(),
        neighborhood: z.string({required_error: 'Preencha o bairro'}),
        state: z.string({required_error: 'Preencha o estado'}).length(2),
        city: z.string({required_error: 'Preencha a cidade'}),
        number: z.string({required_error: 'Preencha o número'}),
        complement: z.string().optional()
    }).optional(),
    date: z.string({required_error: 'Preencha a data!'}).date('Preencha a data corretamente!').optional(),
    hour: z.string({required_error: 'Preencha a hora'}).time('Preencha o horario corretamente!').optional(),
    endTime: z.string({required_error: 'Preencha a hora'}).time('Preencha o horario corretamente!').optional(),
    numberOfGuests: z.number({required_error: 'Preencha a quantidade de convidados!'}).gte(2, 'É preciso no mínimo dois convidados').optional(),
    parcialValue: z.number().optional(),
    owner: z.string().optional(),
    services: z.array(z.object({
        partnerId:z.string(),
        services:z.array(z.string()),
        description:z.string(),
        value:z.number(),
    })).optional(),
    description: z.string().min(2, 'A descrição deve conter no minimo dois caracteres!').optional(),
    todoList: z.array(z.object({
        status:z.boolean(),
        todoItem:z.number(),
        todoDescription:z.string(),
    })).optional(),
    budgets: z.array(z.object({
        budgetItem:z.number(),
        date:z.string(),
        description:z.string(),
        value:z.number(),
        services:z.array(z.string()),
        event:z.string(),
        status:z.string(),
        partnerId:z.string(),
    })).optional(),
    payments:z.array(z.object({
        date:z.string(),
        value:z.number(),
        service:z.string(),
        description:z.string(),
        status:z.string(),
    })).optional(),
})

export type EventType = z.infer<typeof zEventShema>