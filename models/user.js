var mongoose = require('mongoose');

var User = mongoose.Schema({
    email: String,
    flavors: [String],
    cola: String
});


module.exports = mongoose.model('user', User);
