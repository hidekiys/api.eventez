import { Schema, model, connection, Model } from 'mongoose'


import { UserType } from '../services/userSchema';


const schema = new Schema<UserType>({
    name:{
        firstName: { type: String, required: true },
        lastName: String
    },
    password: { type: String, required: true },
    phone: String,
    email: {type: String, required: true},
    address: {
        cep: String,
        street: String,
        addressNumber: Number,
        neighborhood: String,
        state: String,
        city: String
    },
    document: Number,
    events: [],
    balance: Number,
    checked: Boolean,
    validation: String,
    alerts: [{
        date: String,
        description: String
    }],
    url_avatar: String,
    chats:[String],
    cards:[{
        brand:String,
        lastNumbers:String,
        token:String,
    }]
});

const modelName: string = 'User';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] as Model<UserType>
     :
    model<UserType>(modelName, schema);