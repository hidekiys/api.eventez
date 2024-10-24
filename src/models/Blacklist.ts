import { Schema, model, connection, Model } from 'mongoose'

type BlacklistType = {
    token: string
}

const schema = new Schema<BlacklistType>({
    token: String
})


const modelName: string = 'Blacklist';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] as Model<BlacklistType>
     :
    model<BlacklistType>(modelName, schema);