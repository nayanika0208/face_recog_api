const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const Clarifai =require ('clarifai');
const cors = require('cors')
const bodyParser =require('body-parser');
const knex =require('knex');
const register= require('./controllers/register');
const image= require('./controllers/image');
const signin= require('./controllers/signin');
const profile= require('./controllers/profile');

const db=knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'nayanika',
    database : 'smart-brain'
  }
});

const api = new Clarifai.App({
 apiKey: 'a1b5bd3e06b14215a52ebc0054ef5438'
});



const app = express();
app.use(bodyParser.json());
app.use(cors());

 app.post('/imageUrl',(req,res)=>{
 	api.models.predict (Clarifai.FACE_DETECT_MODEL, req.body.input)
 	.then(data=>{
 		res.json(data)
 	}).catch(err=>res.status(400).json('unable to work with api'))
 })

app.get('/',(req,res)=>{
	res.send('it is working');
})

app.post('/signIn',(req,res)=>{signin.handleSignin(req,res,db,bcrypt)})

app.get('/profile/:id',(req,res)=>{profile.handleProfileGet(req,res,db)})

app.put('/image',(req,res)=>{image.handleImage(req,res,db)})

app.post('/register',(req,res)=>{register.handleRegister(req,res,db,bcrypt)})



app.listen(process.env.PORT || 3000,()=>{
	console.log('App is Running! on port ${process.env.PORT}');
})

/*


*/
