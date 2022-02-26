//'mongodb://localhost:27017/MyLibraryMain'
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const StudentSchema = new schema({
  userid :String,
  pid:String,
  courseid:String,
        Name :String,
      phone :Number,
      quali:String,
      sub:String,
      perc:Number,
      year:Number,
      course:String,
      status:String

});

var student = mongoose.model('students',StudentSchema);
module.exports = student;