var express = require("express");
var router = express.Router({mergeParams: true});
var Temazcal = require("../models/temazcal"),
    Comment = require("../models/comment");

//Comments New
router.get("/nuevo", isLoggedIn, function(req, res){
    Temazcal.findById(req.params.id, function(err, temazcal){
       if(err){
           console.log(err);
       } else {
            res.render("comments/new", {temazcal: temazcal});
       }
       
    });
    
});

//Comments create
router.post("/", isLoggedIn, function(req, res){
    Temazcal.findById(req.params.id, function(err, temazcal){
        if(err){
            console.log(err);
            res.redirect("/temazcales");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    temazcal.comments.push(comment);
                    temazcal.save();
                    res.redirect('/temazcales/' + temazcal._id);
                }
            });
        }
    })
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;