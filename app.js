var express         = require ("express"),
    app             = express(),
    bodyParser      =require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Temazcal        = require("./models/temazcal"),
    Comment         = require("./models/comment"),
    methodOverride  = require("method-override"),
    User            = require("./models/user"),
    seedDB        = require("./seeds");
    // seedDB(); //seed the database
    
    var commentRoutes = require("./routes/comments"),
        temazcalesRoutes = require("./routes/temazcales"),
        indexRoutes = require("./routes/index");
    
mongoose.connect("mongodb://localhost/temazcales");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "estos temazcales seran la onda",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


app.use(indexRoutes);
app.use("/temazcales/:id/comentarios", commentRoutes);
app.use("/temazcales", temazcalesRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Temazcales en Mexico server on");
})