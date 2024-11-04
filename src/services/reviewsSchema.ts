import z, { date, number } from 'zod'

export const zReviewSchema = z.object ({
    partnerId:z.string(),
    writer: z.string(),
    text:z.object({
        title:z.string(),
        description:z.string()
    }),
    rate:z.number(),
    createdAt:z.date(),


})

export type ReviewType = z.infer<typeof zReviewSchema>