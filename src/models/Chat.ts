import mongoose, { Schema, model, connection, Model } from 'mongoose'


import { ChatType } from '../services/chatSchema';


const schema = new Schema<ChatType>({
    message:{
        text:String,
        
    },
    users:[String],
    sender: mongoose.Schema.Types.ObjectId,
    
},
{
    timestamps:true,
}
);

const modelName: string = 'Chat';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] as Model<ChatType>
     :
    model<ChatType>(modelName, schema);