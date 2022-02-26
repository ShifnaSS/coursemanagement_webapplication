
//'mongodb://localhost:27017/MyLibraryMain'
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const CourseSchema = new schema({
        userid:String,
        yourname :String,
        coursename :String,
        coursedecs :String,
        duration :String,
        fee :Number,
        seats:Number,
});

var course = mongoose.model('courses',CourseSchema);
module.exports = course;