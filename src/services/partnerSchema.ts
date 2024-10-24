import z, { number } from 'zod'

const zPartnerSchema = z.object({
    document: z.string(),
    name: z.string().min(2),
    types: z.array(z.string()),
    banner:z.string(),
    email: z.string(),
    password: z.string(),
    url_avatar: z.string(),
    about: z.string(),
    local: z.object({
        cep: z.string().length(11),
        street: z.string(),
        neighborhood: z.string(),
        state: z.string().length(2),
        city: z.string(),
        number: z.number(),
        complement:z.string()
    }),
    offerServices: z.array(z.object({
        name: z.string(),
        description:z.string(),
        averagePrice:z.number(),
    })),
    budgets: z.array(z.object({
        budgetItem: z.number(),
        date: z.string(),
        description: z.string(),
        user: z.string(),
        userName: z.string(),
        eventName: z.string(),
        eventNumberOfGuests: z.number(),
        services: z.array(z.string()),
        value: z.number(),
        event: z.string(),
        status: z.string(),
    })).optional(),
    notifications: z.array(z.object({
        type:z.string(),
        data:z.string(),
        hora:z.string(),
        description:z.string(),
        event:z.string(),
        sender: z.string()
    })).optional(),
    receipts:z.array(z.object({
        date:z.string(),
        value:z.number(),
        event:z.string(),
        user:z.string(),
        status:z.string(),
    })).optional(),
    services:z.array(z.object({
        name:z.string(),
        description:z.string(),
        averagePrice:z.number(),
    })).optional(),
    questions:z.array(z.object({
        ask:z.string(),
        response:z.string(),
    })).optional(),
    images:z.array(z.string()).optional(),
    rate:z.number(),
    reviews:z.array(z.object({
        user:z.string(),
        title: z.string(),
        score: z.number(),
        description:z.string(),
        images:z.array(z.string()).optional(),
    })).optional(),
    chats:z.array(z.string()).optional()
})

export type PartnerType = z.infer<typeof zPartnerSchema>