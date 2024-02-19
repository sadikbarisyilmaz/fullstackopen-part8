import { Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const schema = new Schema({
    value: {
        type: String,
    },
})

schema.plugin(uniqueValidator)

export const Token = model('Token', schema)