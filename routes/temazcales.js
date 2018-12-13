var express = require("express");
var router = express.Router();
var Temazcal = require("../models/temazcal");

router.get("/", function(req, res){
    Temazcal.find({}, function(err, allTemazcales){
        if(err){
            console.log(err);
        }else {
            res.render("temazcales/index", {temazcales:allTemazcales});
        }
    });
    
});

router.post("/", isLoggedIn, function(req, res){
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

router.get("/nuevo", isLoggedIn, function(req,res){
   res.render("temazcales/new.ejs");
});

router.get("/:id", function(req, res){
    Temazcal.findById(req.params.id).populate("comments").exec(function(err, foundTemazcal){
        if(err){
            console.log(err);
        }else{
            console.log(foundTemazcal);
        res.render("temazcales/show", {temazcal: foundTemazcal});
        }
    })
});

// EDIT
router.get("/:id/editar", checkTemazcalOwnership, function(req, res){
    
        Temazcal.findById(req.params.id, function(err, foundTemazcal){
              res.render("temazcales/edit", {temazcal: foundTemazcal});
               
        });
});


//UPDATE
router.put("/:id", checkTemazcalOwnership, function(req, res){
   Temazcal.findByIdAndUpdate(req.params.id, req.body.temazcal, function(err, updatedTemzcal){
      if(err){
          res.redirect("/temazcales");
      } else {
          res.redirect("/temazcales/" + req.params.id);
      }
   });
});

//destroy
router.delete("/:id", checkTemazcalOwnership, function(req, res){
    Temazcal.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/temazcales");
        } else {
            res.redirect("/temazcales");
        }
    })
})

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkTemazcalOwnership(req, res, next){
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


module.exports = router;