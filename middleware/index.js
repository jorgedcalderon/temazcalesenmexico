var Temazcal = require("../models/temazcal"),
    Comment = require("../models/comment");

var middlewareObj = {};
    
    middlewareObj.checkTemazcalOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Temazcal.findById(req.params.id, function(err, foundTemazcal){
           if(err){
               res.redirect("back");
           } else {
               if(foundTemazcal.author.id.equals(req.user._id)) {
                   next();
               } else {
                   res.redirect("back");
               }
           }
        });
    } else {
        res.redirect("back");
    }

    }
    
    middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comentario_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           } else {
               if(foundComment.author.id.equals(req.user._id)) {
                   next();
               } else {
                   res.redirect("back");
               }
           }
        });
    } else {
        res.redirect("back");
    }

    }
    
    middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
    







module.exports = middlewareObj;