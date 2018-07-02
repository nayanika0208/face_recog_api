const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const Clarifai =require ('clarifai');
const cors = require('cors')
const bodyParser =require('body-parser');
const knex =require('knex');
const db=knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'nayanika0208',
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
 	})
 })

app.get('/',(req,res)=>{
	res.send(database.users);
})

app.post('/signIn',(req,res)=>{
const {email,password} =req.body;
	if(!email || !password){
		return res.status(400).json('please enter valid details')
	}
	db.select('email','hash').from('login')
	.where('email','=',email)
	.then(data=>{
     const isValid= bcrypt.compareSync(req.body.password, data[0].hash);
     if (isValid){
     	return db.select('*').from('users')
     	.where('email','=',email)
     	.then(user=>{
     		res.json(user[0])
     	}).catch(err=>res.status(400).json('unable to get user'))
     }else{
        res.status(400).json('wrong credintials')
     }
	}).catch(err=>res.status(400).json('wrong credintials'))

})

app.get('/profile/:id',(req,res)=>{
	const { id} =req.params;
	db.select('*').from('users').where({
		id:id
	}).then(user=>{
		if(user.length){
		res.json(user[0]);
		}else{
        res.status(400).json('not found')
		}
	

	}).catch(err=>res.status(400).json('error getting user'))
})

app.put('/image',(req,res)=>{
	const { id} =req.body;
	db('users').where('id', '=', id)
		.increment('entries',1)
		.returning('entries')
		.then(entries=>{
			res.json(entries[0])
		}).catch(err=>{
			res.status(400).json('unable to get count')
		})

})
app.post('/register',(req,res)=>{

	const {email ,name ,password} =req.body;
	if(!name || !email || !password){
		return res.status(400).json('please enter valid details')
	}
	const hash = bcrypt.hashSync(password);
db.transaction(trx=>{
	trx.insert({
		hash:hash,
		email:email
	  })
		.into('login')
		.returning('email')
		.then(loginEmail=>{
           return trx('users')
		      .returning('*')
		      .insert({
		    	email:loginEmail[0],
		    	name:name,
		    	joined:new Date()
		        }).then(user=>{
		    	res.json(user[0]);
		})
	}).then(trx.commit)
		.catch(trx.rollback)
	}).catch(err=> res.status(400).json('unable to register'))

	
})



app.listen(3000,()=>{
	console.log('App is Running! on port 3000');
})

/*


*/