import z, { date, number } from 'zod'

export const zNotificationSchema = z.object ({
    notificationType:z.string(),
    users:z.object({
        sender:z.string(),
        receiver:z.string(),
    }),
    event:z.string(),
    created:z.date()

})

export type NotificationType = z.infer<typeof zNotificationSchema>