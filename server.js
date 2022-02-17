const express = require('express')
const bcrypt = require('bcrypt')
const session = require('express-session')
const app = express()

app.use(express.json())

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret:'3184713087103870413duduuue28',
    cookie:{
        maxAge:1800000 //after 30 mins the session will expire
    }
}))

users = [] //for demonstration purpose only. NOT FIT FOR PRODUCTION

app.get('/db', (req, res)=>{ //DataBase Entries
    res.send(users)
})

app.post('/db/logout', (req, res)=>{ //Logout
    req.session.userID=null
    res.send('logged out')
})

app.patch('/db/forgetpass', async (req, res)=>{
    const hashPass = await bcrypt.hash(req.body.password, 10)
    const user = users.find(user => user.name == req.body.name)
    if(user==null){
        return res.send("No user found with this name")
    }
    user.password = hashPass
    res.send("Password Updated Successfully")
})

app.post('/db/dashboard', (req, res)=>{ //Dashboard
    if(!req.session.userID) return res.send('login again')
    const user = users.find(user => user.id == req.session.userID)
    res.send(user)
})

app.post('/db/login', async (req, res)=>{  //Login
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

app.post('/db/signup', async (req, res)=>{  //Signup
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