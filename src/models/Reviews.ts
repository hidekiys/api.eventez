import mongoose, { Schema, model, connection, Model } from 'mongoose'


import { ReviewType } from '../services/reviewsSchema';


const schema = new Schema<ReviewType>({
    partnerId:String,
    writer: String,
    text:{
        title:String,
        description:String
    },
    rate:Number,
    createdAt: { type: Date, default: () => Date.now() - 3*60*60*1000 }
},
);

const modelName: string = 'Reviews';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] as Model<ReviewType>
     :
    model<ReviewType>(modelName, schema);