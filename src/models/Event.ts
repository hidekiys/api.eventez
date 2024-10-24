import { Schema, model, connection, Model } from 'mongoose'


import { EventType } from '../services/eventSchema';


const schema = new Schema<EventType>({
    name: String,
    types: [String],
    publicOfEvent: [String],
    status: String,
    place: {
        placeName: String,
        cep: String,
        street: String,
        neighborhood: String,
        state: String,
        city: String,
        number: String,
        complement: String
    },
    date: String,
    hour: String,
    endTime: String,
    numberOfGuests: Number,
    parcialValue: Number,
    owner: String,
        services: [{
            partnerId:String,
            services:[String],
            description:String,
            value:Number,
        }],
    description: String,
    todoList: [{
        todoItem:Number,
        status:Boolean,
        todoDescription:String
    }],
    budgets: [{
        budgetItem: Number,
        date: String,
        description:String,
        value:Number,
        services:[String],
        event:String,
        status:String,
        partnerId:String
    }],
    payments:[{
        date:String,
        value:Number,
        service:String,
        description:String,
        status:String,
    }]
});

const modelName: string = 'Event';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] as Model<EventType>
     :
    model<EventType>(modelName, schema);