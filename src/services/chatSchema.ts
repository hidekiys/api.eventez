import z, { date, number } from 'zod'

export const zChatSchema = z.object ({
    message:z.object({
    text: z.string(),

}),
users:z.array(z.string()),
sender: z.string(),

})

export type ChatType = z.infer<typeof zChatSchema>