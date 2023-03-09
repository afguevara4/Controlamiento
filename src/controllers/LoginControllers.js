const bcrypt = require('bcrypt');
const { data } = require('../utils/logger');
const logger = require('../utils/logger')

function login(req, res){
    if(req.session.loggedin != true){
        res.render('login/index');
    }else{
        res.redirect('/');   
    }
}

function register(req, res){
    if(req.session.loggedin != true){
        res.render('login/register');
    }else{
        res.redirect('/');    
    }

}

function register2(req, res){
    if(req.session.loggedin != true){
        res.render('login/register2');
    }else{
        res.redirect('/');    
    }
}

function auth(req, res){
    const data = req.body;

    req.getConnection((err, conn) => {
        if(data.name == "Admin1"){
            conn.query('SELECT * FROM roles WHERE name = ?', [data.name], (err, userdata) => {
            
                if(userdata.length > 0){
                    userdata.forEach(element => {
                        bcrypt.compare(data.password, element.password, (err, isMatch) => {
                            if(!isMatch){
                                res.render('login/index', {error: 'Error: Contraseña incorrecta!'});
                                logger.info(`${element.name}: contraseña incorrecta`);
                            }else{
                                
                                req.session.loggedin = true;
                                req.session.name = element.name;
    
                                res.redirect('/');
                                logger.info(`Usuario inicio session: ${element.name}`);
                            }
                        });
                        
                    });
                }else{
                    res.render('login/index', {error: 'Error: El usuario no existe!'});
                }
            });
        } else{
            conn.query('SELECT * FROM users WHERE email = ?', [data.name], (err, userdata) => {
            
                if(userdata.length > 0){
                    userdata.forEach(element => {
                        bcrypt.compare(data.password, element.password, (err, isMatch) => {
                            if(!isMatch){
                                res.render('login/index', {error: 'Error: Contraseña incorrecta!'});
                                logger.info(`${element.name}: contraseña incorrecta`);
                            }else{
                                
                                req.session.loggedin = true;
                                req.session.name = element.name;
    
                                res.redirect('/');
                                logger.info(`Usuario inicio session: ${element.name}`);
                            }
                        });
                        
                    });
                }else{
                    res.render('login/index', {error: 'Error: El usuario no existe!'});
                }
            });
        }
        
    });
    
}

function storeUser(req, res){
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
            if(userdata.length > 0){
                res.render('login/register2', {error: 'Error: El usuario ya existe!'});
            }else{
                bcrypt.hash(data.password, 12).then(hash => {
        
                    data.password = hash;
                    req.getConnection((err, conn) => {
                        conn.query('INSERT INTO users SET ?', [data], (err, rows) => {
                            
                            req.session.loggedin = true;
                            req.session.name = data.name;
    
                            res.redirect('/');
                            logger.info(`Nuevo usuario creado: ${data.name}`);
                        });
                    });
                    console.log(data);
                });
            }
        });
    });
}

function logout(req , res){
    if(req.session.loggedin == true){

        req.session.destroy();

    }
    res.redirect('/login');
    logger.info('Finalizo la Sesion');
}

module.exports={
    login,
    register,
    register2,
    storeUser,
    auth,
    logout,
}