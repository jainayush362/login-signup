const express = require('express')
const bcrypt = require('bcrypt')
const session = require('express-session')
const app = express()

app.use(express.json())


//for cookies and session
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret:'3184713087103870413duduuue28',
    cookie:{
        maxAge:1800000 //after 30 mins the session will expire
    }
}))

//Local DB for demonstration purpose only. NOT FIT FOR PRODUCTION
users = []


//DataBase Entries
app.get('/db', (req, res)=>{ 
    res.send(users)
})

//Logout
app.post('/db/logout', (req, res)=>{ 
    req.session.userID=null
    res.send('logged out')
})

//Forget Password
app.patch('/db/forgetpass', async (req, res)=>{
    const hashPass = await bcrypt.hash(req.body.password, 10)
    const user = users.find(user => user.name == req.body.name)
    if(user==null){
        return res.send("No user found with this name")
    }
    user.password = hashPass
    res.send("Password Updated Successfully")
})

//Dashboard
app.post('/db/dashboard', (req, res)=>{ 
    if(!req.session.userID) return res.send('login again')
    const user = users.find(user => user.id == req.session.userID)
    res.send(user)
})

//Login
app.post('/db/login', async (req, res)=>{  
    const user = users.find(user => user.name == req.body.name)
    if(user==null){
        return res.send('No user exists')
    }
    const hashPass = await bcrypt.compare(req.body.password, user.password)
    if(!hashPass){
        return res.send('Incorrect Password')
    }
    req.session.userID = user.id
    res.send(`Welcome ${user.name}!`)
})

//Signup
app.post('/db/signup', async (req, res)=>{  
    try{
        const hashPass = await bcrypt.hash(req.body.password, 10)
        const user = {id: req.body.id, name: req.body.name, password: hashPass}
        users.push(user)
        res.send('User Added')
    }catch{
        res.send('Some error occured')
    }
})

app.listen(3000)