import mongoose from 'mongoose';
import { logger } from './utils.js.js';
const { Schema } = mongoose;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.x1jrh.mongodb.net/tracker?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
        logger("Connected to the database");
});


const productSchema = new Schema({
        code: {type: String, unique: true},
        threshold: Number,
        notifiedPrices: {type: [Number], default: []}, 
        chatIds: {type: [Number], default: []}, 
})

export const Product = mongoose.model('product', productSchema);