require('dotenv').config()
const express = require('express');
const app = express();
const multer = require('multer');
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

app.use(bodyParser.json());
var publicDir = require('path').join(__dirname,'../');

app.get('/form',(req,res)=>{
    console.log(process.env.AWS_ACCESS_KEY_ID)
    console.log(process.env.AWS_SECRET_ACCESS_KEY);
    res.sendFile(`${publicDir}/Frontend/index.html`);
})

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "ap-south-1"
})

const s3 = new aws.S3({ apiVersion: '2006-03-01' });


const upload = multer({
    storage: multerS3({
        s3,
        bucket: "ieeyesisttest",
        acl: 'public-read',
        metadata: (req,file,done) => {
            done(null, {fieldName: file.fieldname});
        },
        key: (req,file,done) => {
            const ext = file.originalname.split(".").pop();
            done(null, `${uuidv4()}.${ext}`);
        }
    })
})

app.post('/upload', upload.single("datafile"), (req, res) => {
    console.log(req.body.fname);
    console.log(req.body.lname);
    console.log(req.file);
    res.send({success: true});
})

app.listen(3000, () => {
    console.log("Server started at port 3000");
})