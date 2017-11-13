const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beerSchema = new Schema({
    name: {
        type: String,
        required: [true, "What is the beer's name/brand?"]
    },
    brewery: {
        type: String
    },
    image: {
        type: String,
        required: [true, "The beer most have an image to display"]
    },
    origin: {
        type: String
    },
    type: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const BeerModel = mongoose.model('Beer', beerSchema);

module.exports = BeerModel;