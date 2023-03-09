const express = require('express');
const { engine } = require('express-handlebars');
const myconnection = require('express-myconnection');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const winston = require('winston')

const loginRoutes = require('./routes/login');
const logger = require('./utils/logger');
const { type } = require('express/lib/response');

const app = express();
app.set('port', 4000);

app.set('views', __dirname + '/views');
app.engine('.hbs', engine({
    extname: '.hbs',
}));

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(myconnection(mysql,{
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'nodelogin'
}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.listen(app.get('port'), () =>{
    console.log('Listening on port', app.get('port'));
});

app.use('/', loginRoutes);

app.get('/', (req,res) =>{
    if(req.session.loggedin == true && req.session.name =="Admin1"){
        res.render('home2', {name: req.session.name});
    }else if(req.session.loggedin == false){
        res.redirect('/login');   
    }else{
        res.render('home', {name: req.session.name});
    }
});


  


  


//inyeccion sql 
