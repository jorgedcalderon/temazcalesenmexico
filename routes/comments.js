var express = require("express");
var router = express.Router({mergeParams: true});
var Temazcal = require("../models/temazcal"),
    Comment = require("../models/comment");
    var middleware = require("../middleware");

//Comments New
router.get("/nuevo", middleware.isLoggedIn, function(req, res){
    Temazcal.findById(req.params.id, function(err, temazcal){
       if(err){
           console.log(err);
       } else {
            res.render("comments/new", {temazcal: temazcal});
       }
       
    });
    
});

//Comments create
router.post("/", middleware.isLoggedIn, function(req, res){
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
                    res.redirect('/temazcales/' + temazcal._id+'#zonaComentarios');
                }
            });
        }
    })
});

//COMMENT EDIT
router.get("/:comentario_id/editar", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comentario_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else {
           res.render("comments/edit", {temazcal_id: req.params.id, comment: foundComment}); 
        }
    });
    
   
});

//COMMENT UPDATE
router.put("/:comentario_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comentario_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/temazcales/"+req.params.id+'#zonaComentarios');
        }
    });
});

//Comment DESTROY
router.delete("/:comentario_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comentario_id, function(err){
       if(err){
           res.redirect("back");
       }else{
           res.redirect("/temazcales/"+req.params.id+"#zonaComentarios");
       }
   })
});



module.exports = router;