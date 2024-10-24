import { Schema, model, connection, Model } from 'mongoose'


import { PartnerType } from '../services/partnerSchema';

const schema = new Schema<PartnerType>({
    document: String,
    name: String,
    banner: String,
    url_avatar: String,
    email: String,
    password: String,
    types: [String],
    about: String,
    local: {
        cep: String,
        street: String,
        neighborhood: String,
        state: String,
        city: String,
        complement:String,
        number:Number
    },
    offerServices: [{
        name:String,
        description:String,
        averagePrice:Number,
    }],
    budgets: [{
        budgetItem: Number,
        eventName:String,
        eventNumberOfGuests:Number,
        userName:String,
        description:String,
        date: String,
        user: String,
        services: [String],
        value: Number,
        event: String,
        status: String,
    }],
    notifications: [{
        type:String,
        data:String,
        hora:String,
        description:String,
        event:String,
        sender: String
    }],
    receipts:[{
        date:String,
        value:Number,
        event:String,
        user:String,
        status:String,
    }],
    services:[{
        name:String,
        description:String,
        averagePrice:Number,
    }],
    questions:[{
        ask:String,
        response:String,
    }],
    images:[String],
    rate:Number,
    reviews:[{
        user:String,
        title: String,
        score: Number,
        description:String,
        images:[String],
    }],
    chats:[String]
})





const modelName: string = 'Partner';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] as Model<PartnerType>
     :
    model<PartnerType>(modelName, schema);