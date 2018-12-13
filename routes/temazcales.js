var express = require("express");
var router = express.Router();
var Temazcal = require("../models/temazcal");
var middleware = require("../middleware");

router.get("/", function(req, res){
    Temazcal.find({}, function(err, allTemazcales){
        if(err){
            console.log(err);
        }else {
            res.render("temazcales/index", {temazcales:allTemazcales});
        }
    });
    
});

router.post("/", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newTemazcal = {name: name, image: image, description: desc, author: author}
   Temazcal.create(newTemazcal, function(err, newlyCreated){
      if(err){
          console.log(err);
      } else {
          res.redirect("temazcales");
      }
   });
   
});

router.get("/nuevo", middleware.isLoggedIn, function(req,res){
   res.render("temazcales/new.ejs");
});

router.get("/:id", function(req, res){
    Temazcal.findById(req.params.id).populate("comments").exec(function(err, foundTemazcal){
        if(err){
            console.log(err);
        }else{
            //console.log(foundTemazcal);
        res.render("temazcales/show", {temazcal: foundTemazcal});
        }
    })
});

// EDIT
router.get("/:id/editar", middleware.checkTemazcalOwnership, function(req, res){
    
        Temazcal.findById(req.params.id, function(err, foundTemazcal){
              res.render("temazcales/edit", {temazcal: foundTemazcal});
               
        });
});


//UPDATE
router.put("/:id", middleware.checkTemazcalOwnership, function(req, res){
   Temazcal.findByIdAndUpdate(req.params.id, req.body.temazcal, function(err, updatedTemzcal){
      if(err){
          res.redirect("/temazcales");
      } else {
          res.redirect("/temazcales/" + req.params.id);
      }
   });
});

//destroy
router.delete("/:id", middleware.checkTemazcalOwnership, function(req, res){
    Temazcal.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/temazcales");
        } else {
            res.redirect("/temazcales");
        }
    })
})




module.exports = router;