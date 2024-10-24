import z, { date, number } from 'zod'

export const zFinancialSchema = z.object ({
    users:z.object({
        user:z.string(),
        partner:z.string(),
    }),
    event:z.string(),
    service:z.object({
        service:z.string(),
        description:z.string(),
    }),
    value:z.number(),
    status:z.object({
        user:z.string(),
        partner:z.string()
    }),
    payment:z.object({
        order:z.string(),
        charge:z.string(),
        paymentMethod:z.string(),
    }),
    created:z.date()

})

export type FinancialType = z.infer<typeof zFinancialSchema>