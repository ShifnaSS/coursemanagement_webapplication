const express = require('express');
const cors = require('cors');
const path = require('path');
const port = process.env.PORT || 3400;
let jwt =require('jsonwebtoken');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@cluster0.hypiv.mongodb.net/CMS?retryWrites=true&w=majority');
const professor_data = require('./src/model/professor');
const course_data = require('./src/model/course');
const sign_data = require('./src/model/signup');
const stud_ent = require('./src/model/student');
const sta_tus = require('./src/model/app_status');
var app = new express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
    next();
});

app.get('/',function(req,res){

    res.send("success")
})
function verifyToken(req, res, next) {//token
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    console.log(token)
    if (token === 'null') {
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'secretKey')
    if (!payload) {
        return res.status(401).send('Unauthorized request')
    }
    // req.userId = payload.subject
    next()
}


//login

app.post('/checklogin',function(req,res){
    var logind = req.body.logindata;
    var loginusername = logind.username;
    var loginpassword = logind.password;
    sign_data.findOne({'email':loginusername,'pass1':loginpassword})
    .then((obj)=>{
        if(obj!=null){
            let payload = {subject:loginusername+loginpassword}
            let token = jwt.sign(payload,'secretKey')
            res.status(200).send({token,obj});
            console.log(token)  
        }
        else{
            res.send(obj);
        }
       
        // if(obj!==null)
        // {
        //     res.status(200).send(obj);
        // }
        // else{
        //     res.status(401).send({message})
        // }
    })
    .catch((err)=>{
        console.log("error when handling login/signup checking",err)
    })
})

//login


//adding Professor
app.post('/addprofessor',verifyToken,function(req,res){
    console.log("entered")
    console.log("professor data from fornt end",req.body.pdata)
    var data = JSON.parse(req.body.pdata);
    console.log(data);
    var newprofessor = {
        userid:req.body.id,
        Name :data.Name,
        phone :data.phone,
        qualification :data.qualification,
        stream :data.stream,
        organisation :data.organisation,
        jobrole:data.jobrole,
        prev_job:data.prev_job,
        exp:data.exp,
        email_id:data.email_id,

    }
    var professordata = new professor_data(newprofessor);
    professordata.save()
    .catch((err)=>{
        console.log("error when adding professor details"+err);
    })
   
})
//adding Professor

//adding Signup data
app.post('/addsignup',function(req,res){
    console.log("entered")
    var sdata = req.body.sdata;
    console.log("signup data from fornt end",sdata)
    // var c = JSON.parse(req.body.sdata);
    // console.log(data);
    var signupdata = {
        name:sdata.name,
        gender:sdata.gender,
        phone:sdata.phone,
        email:sdata.email,
        role:sdata.role,
        pass1:sdata.pass1,
        pass2:sdata.pass2,
    }
    // var signupdata = sdata;
    console.log(signupdata)
    var signup = new sign_data(signupdata);
    signup.save()
    .catch((err)=>{
         console.log("error when adding courses"+err)
     })
   
})

//adding Professor

//adding courses
app.post('/addcourse',verifyToken,function(req,res){
    console.log("entered")
    console.log("course data from fornt end",req.body.coursedata)
    var c = req.body.coursedata;
    var id =  req.body.id;
    var newcourse = {
        userid : id,
        yourname :c.yourname,
        coursename :c.coursename,
        coursedecs :c.coursedecs,
        duration :c.duration,
        fee :c.fee,
        seats:c.seats
    }
    var cousedata = new course_data(newcourse);
    cousedata.save()
    .catch((err)=>{
        console.log("error when adding courses"+err)
    })
   
})
//adding courses


//getUserSignup Details

app.get('/getuserdata/:id',verifyToken,function(req,res){
    var id = req.params.id;
    console.log("userid for getting signup data",id);
    sign_data.findOne({'_id':id})
    .then((obj)=>{
        res.send(obj);
    })
    .catch((err)=>{
        console.log("error :signup details ",err)
    })
})
//getUserSignup Details

//getProfile details

app.get('/getprofiledata/:id',verifyToken,function(req,res){
    var id = req.params.id;
    console.log("userid for getting profile data",id);
    professor_data.findOne({'userid':id})
    .then((obj)=>{
        res.send(obj);
    })
    .catch((err)=>{
        console.log("error :Profile details ",err)
    })
})

//getProfile details

//update professor data

app.post('/updateprofessor/:id',verifyToken,function(req,res){
    console.log("entered for updating professor details")
    var pdata = JSON.parse(req.body.pdata);
    var _id = req.params.id;
    var userid = req.body.userid;
    var Name =pdata.Name;
    var phone =pdata.phone;
    var qualification =pdata.qualification;
    var stream =pdata.stream;
    var organisation =pdata.organisation;
    var jobrole=pdata.jobrole;
    var prev_job=pdata.prev_job;
    var exp=pdata.exp;
    var email_id=pdata.email_id;
    console.log("data to be updated is",pdata,_id,userid)
    professor_data.findByIdAndUpdate({'_id':_id},{$set:{
        'Name':Name,
        'qualification':qualification,
        'phone':phone,
        'stream':stream,
        'organisation':organisation,
        'jobrole':jobrole,
        'prev_job':prev_job,
        'exp':exp,
        'email_id':email_id
    }})
    .then((data)=>{
        res.send(data);
        console.log("updated",data)
    })
    .catch((err)=>{
        console.log("error when updating data",err)
    })
})


//update professor data

//delete professor
app.delete('/deleteprofessor/:id',verifyToken,function(req,res){
    console.log("delete professor request")
    var id = req.params.id;
    professor_data.deleteOne({'_id':id})
    .then((data)=>{
        console.log("deleted",data);
        res.send(data);
    })
    .catch((err)=>{
        console.log("error when deleting professor data",err);
    })
})
//delete Professor

//getCourses
app.get('/getCourses/:id',verifyToken,function(req,res){
    var id = req.params.id;
    course_data.findOne({'_id':id})
    .then((courses)=>{
        res.send(courses);
    })
    .catch((err)=>{
        console.log('error loading courses',err);
    })
})

//getCourses

//getAllCOurses

app.get('/getAllCourses',verifyToken,function(req,res){

    course_data.find()
    .then((courses)=>{
        res.send(courses);
    })
    .catch((err)=>{
        console.log('error loading courses',err);
    })
})

//getAllCourses

//getmycourses

app.get('/mycourses/:id',verifyToken,function(req,res){
    course_data.find({'userid':req.params.id})
    .then((mycourses)=>{
        res.send(mycourses);
        console.log(mycourses);
    })
    .catch((err)=>{
        console.log('error loading mycourses',err);
    })
})

//getmycourses


//getting Applications

app.get('/applications/:id',verifyToken,function(req,res){
    var userid = req.params.id;
    var status = 'pending';
    stud_ent.find({'pid':userid})
    .then((applications)=>{
        res.send(applications);
        console.log(applications);
    })
    .catch((err)=>{
        console.log('error loading applications',err);
    })
})

//getting Applications

//adding student registration

app.post('/addstudent',verifyToken,function(req,res){
    var student = req.body.studentdata;
    var id = req.body.id;
    var proid = req.body.proid;
    var cid=req.body.courseid;
    console.log('student data from frontend',student,id,proid,cid)
    var newstudent = {
        userid :id,
        pid:proid,
        courseid:cid,
        Name :student.Name,
        phone :student.phone,
        quali:student.quali,
        sub:student.sub,
        perc:student.perc,
        year:student.year,
        course:student.course,
        status:'Pending'
    }
    console.log(newstudent);
    var studentdata = new stud_ent(newstudent);
    studentdata.save()
    .catch((err)=>{
        console.log("error when adding student details"+err)
    })
   
})
//adding student registration

//getting Student registration details

app.get('/getdetails/:id',verifyToken,function(req,res){
    var userid = req.params.id;
    stud_ent.find({'userid':userid})
    .then((studentdata)=>{
        res.send(studentdata);
    })
    .catch((err)=>{
        console.log("error when getting student details"+err)
    })
})
//getting Student registration details

//accepting application
app.post('/acceptstatus/:courseid',verifyToken,function(req,res){
    var courseid= req.params.courseid;
    var userid = req.body.userid;
    var status = 'Accepted';
    var seatscount  =req.body.seatscount;
    console.log(courseid,userid);
    stud_ent.findOne({'userid':userid})
    .then((data)=>{
        var accept = {
            userid :data.userid,
            pid:data.pid,
            courseid:data.courseid,
            Name:data.Name,
            phone :data.phone,
            quali:data.quali,
            sub:data.sub,
            perc:data.perc,
            year:data.year,
            course:data.course,
            status:'Accepted'
        }
        var statusdata = new sta_tus(accept);
        statusdata.save();
        course_data.findOneAndUpdate({'_id':courseid},{$set:{'seats':seatscount}},{new:true})
        stud_ent.findOneAndDelete({'userid':userid})
        .then((data)=>{
            res.send(data);
        })
    })
    .catch((err)=>{
        console.log('error when updating status',err);
    })
})
//accepting applications

//rejecting request

app.get('/reject/:userid',verifyToken,function(req,res){
    var userid = req.params.userid;
    var status = 'Rejected';
    stud_ent.findOne({'userid':userid})
    .then((data)=>{
        var reject = {
            userid :data.userid,
            pid:data.pid,
            courseid:data.courseid,
            Name:data.Name,
            phone :data.phone,
            quali:data.quali,
            sub:data.sub,
            perc:data.perc,
            year:data.year,
            course:data.course,
            status:'Rejected'
        }
        var statusdata = new sta_tus(reject);
        statusdata.save();
        stud_ent.findOneAndDelete({'userid':userid})
        .then((data)=>{
            res.send(data);
        })
    })
    .catch((err)=>{
        console.log('error when updating status',err);
    })
})
//rejecting request

//for getting all applications
app.get('/allapplications',verifyToken,function(req,res){
    sta_tus.find()
    .then((data)=>{
        res.send(data);
        console.log(data);
    })
    .catch((err)=>{
        console.log('error loading applications',err);
    })
})
//for getting all applications

//for getting status of applications
app.get('/getstatus/:id',function(req,res){
    sta_tus.find({'pid':req.params.id})
    .then((applications)=>{
        res.send(applications);
        console.log(applications);
    })
    .catch((err)=>{
        console.log('error loading applications',err);
    })
})
//for getting status of applications

//getting all professor details

app.get('/allprofessors',function(req,res){
    professor_data.find()
    .then((data)=>{
        res.send(data);
        console.log(data);
    })
    .catch((err)=>{
        console.log('error loading professors',err);
    })
})
//getting all professor details

//for getting status of students
app.get('/getstatusstudents/:id',verifyToken,function(req,res){
    console.log("enterd for getting statsuses")
    sta_tus.find({'userid':req.params.id})
    .then((applications)=>{
        res.send(applications);
        console.log(applications);
    })
    .catch((err)=>{
        console.log('error loading applications',err);
    })
})


//for getting status of students
app.listen(port,()=>{console.log("Server Ready at" +port)});