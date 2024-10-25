//@ts-nocheck
import mongoose, { Schema, model, connection, Model } from 'mongoose'


import { FinancialType } from '../services/FinancialSchema';


const schema = new Schema<FinancialType>({
    users:{
        user:String,
        partner:String,
    },
    event:String,
    service:{
        service:String,
        description:String,
    },
    value:Number,
    status:{
        user:String,
        partner:String
    },
    payment:{
        paymentMethod:String,
        charge:String,
        order:String,
    },
    created:Date

})

const modelName: string = 'Financial';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] as Model<FinancialType>
     :
    model<FinancialType>(modelName, schema);