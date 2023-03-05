const bcrypt = require('bcrypt');

function login(req, res){
    res.render('login/index');
}

function register(req, res){
    res.render('login/register');
}

function auth(req, res){
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
            
            if(userdata.length > 0){
                userdata.forEach(element => {
                    bcrypt.compare(data.password, element.password, (err, isMatch) => {
                        if(!isMatch){
                            res.render('login/index', {error: 'Error: Contraseña incorrecta!'});
                        }else{
                            
                            req.session.loggedin = true;
                            req.session.name = element.name;

                            res.redirect('/hola');
                        }
                    });
                });
            }else{
                res.render('login/index', {error: 'Error: El usuario no existe!'});
            }
        });
    });
}

function storeUser(req, res){
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
            if(userdata.length > 0){
                res.render('login/register', {error: 'Error: El usuario ya existe!'});
            }else{
                bcrypt.hash(data.password, 12).then(hash => {
        
                    data.password = hash;
                    req.getConnection((err, conn) => {
                        conn.query('INSERT INTO users SET ?', [data], (err, rows) => {
                            res.redirect('/');
                        });
                    });
                    console.log(data);
                });
            }
        });
    });
}

module.exports={
    login,
    register,
    storeUser,
    auth,
}