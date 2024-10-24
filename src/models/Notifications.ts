import mongoose, { Schema, model, connection, Model } from 'mongoose'


import { NotificationType } from '../services/notificationsSchema';


const schema = new Schema<NotificationType>({
    notificationType:String,
    users:{
        sender:String,
        receiver:String,
    },
    event:{
        type:String,
        required:false
    },
    created: { type: Date, default: () => Date.now() - 3*60*60*1000 }
},
);

const modelName: string = 'Notification';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] as Model<NotificationType>
     :
    model<NotificationType>(modelName, schema);