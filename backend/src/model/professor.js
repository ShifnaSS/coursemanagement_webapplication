
//'mongodb://localhost:27017/MyLibraryMain'
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ProfessorSchema = new schema({
        userid:String,
        Name :String,
        phone :String,
        qualification :String,
        stream :String,
        organisation :String,
        jobrole:String,
        prev_job:String,
        exp:String,
        email_id:String,
});

var professor = mongoose.model('professors',ProfessorSchema);
module.exports = professor;