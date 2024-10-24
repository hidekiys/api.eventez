import z, { date, number } from 'zod'

export const zBudgetSchema = z.object ({
    users:z.object({
        user:z.string(),
        partner:z.string(),
    }),
    event:z.string(),
    service:z.object({
        services:z.array(z.string()),
        description:z.string(),
    }),
    budgetDescription:z.string(),
    value:z.number(),
    status:z.object({
        user:z.string(),
        partner:z.string()
    }),
    created:z.date()

})

export type BudgetType = z.infer<typeof zBudgetSchema>