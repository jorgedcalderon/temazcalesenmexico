var express = require("express");
var router = express.Router();
var passport = require("passport"),
    User = require("../models/user");
    
    var bodyParser = require("body-parser");
    var data = require("../data");
var api_key = data.mailKey;
var domain =  data.mailUser;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

//Landing
router.get("/", function(req, res){
    res.render("landing");
});

router.get("/es", function(req, res){
    res.render("landing-es");
});

router.get("/en", function(req, res){
    res.render("landing-en");
});

router.get("/client_info", function(req, res){
    res.render("client-info");
});

router.post("/client_info", function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    console.log(email + name + phone);
    
    var mailData = {
          from: 'Registros de Temazcal <servidor@temazcal.info>',
          to: 'hola@temazcal.info',
          subject: 'Registro en temazcal.info',
          text: 'Un nuevo registro: \n\n' +
          name + '\n\n' + email + '\n\n' + phone +
          '\n'
        };
        
        mailgun.messages().send(mailData, function (error, body) {
          console.log(body);
        });
    
    res.render("client-info");
});

//registrar
router.get("/register", function(req, res){
    res.render("register");    
});


router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username}); 
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/temazcales");
            })
        }
    });
});

router.get("/login", function(req, res){
   res.render("login"); 
});

router.post("/login", passport.authenticate("local", {successRedirect: "/temazcales", failureRedirect: "/login"}), function(req, res){
   
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/temazcales");
})



module.exports = router;