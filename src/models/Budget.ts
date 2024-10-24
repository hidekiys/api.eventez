import mongoose, { Schema, model, connection, Model } from 'mongoose'


import { BudgetType } from '../services/budgetSchema';


const schema = new Schema<BudgetType>({
    users:{
        user:String,
        partner:String,
    },
    event:String,
    service:{
        services:[String],
        description:String,
    },
    budgetDescription:String,
    value:Number,
    status:{
        user:String,
        partner:String
    },
    created:Date

})

const modelName: string = 'Budget';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] as Model<BudgetType>
     :
    model<BudgetType>(modelName, schema);