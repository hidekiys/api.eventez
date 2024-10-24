import z from 'zod';

export const zUserSchema = z.object( {
    name: z.object({
        firstName: z.string({ required_error: 'Preencha o nome corretamente!' }).min(2, 'O nome deve ter no minimo duas letras.'),
        lastName: z.string().min(2).optional()
    }),
    password: z.string({required_error:'A senha deve ser preenchida'})
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/, 'A senha deve conter ao menos uma letra minúscula, uma maiúscula, um caratere especial e 8 caracteres'),
    phone: z.string().length(11, 'Preencha o número corretamente').optional(),
    email: z.string({required_error:'Preencha o campo email'}).email('Preencha o email corretamente').toLowerCase(),
    address: z.object({
        cep: z.string().length(8),
        street: z.string(),
        addressNumber: z.number(),
        neighborhood: z.string(),
        state: z.string().min(1).max(2),
        city: z.string().min(2)
    }).optional(),
    document: z.number().min(10).optional(),
    events: z.array(z.string()).optional(),
    balance: z.number().optional(),
    checked: z.boolean().default(false),
    validation: z.string().optional(),
    alerts: z.array(z.object({
        date: z.string().datetime(),
        description: z.string()
    })).optional(),
    url_avatar: z.string().optional(),
    chats:z.array(z.string()).optional(),
    cards:z.array(z.object({
        brand:z.string(),
        lastNumbers:z.string(),
        token:z.string(),
    })).optional()
})

export type UserType = z.infer<typeof zUserSchema>