//'mongodb://localhost:27017/MyLibraryMain'
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const SignupSchema = new schema({
    name:String,
    gender:String,
    phone:String,
    email:String,
    role:String,
    pass1:String,
    pass2:String,
});

var signup = mongoose.model('signupdatas',SignupSchema);
module.exports = signup;