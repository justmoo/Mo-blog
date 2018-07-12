var express = require('express');
var app = express();
var methodOverride = require("method-override");
var mongoose = require('mongoose');
var bodyParser = require("body-parser");



// mongoose.connect('mongodb://localhost/Blog');

mongoose.connect(process.env.DATABASEURL);



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine" , "ejs");
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + "/public/"));
app.use(methodOverride("_method"));

var Schema = mongoose.Schema;

  var blogSchema = new Schema({
    title:  String,
    author: String,
    body:   String,
    image: String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
      votes: Number,
      favs:  Number
    }
  });
  var Blog = mongoose.model('Blog', blogSchema);
  
//  var  blog1 = new Blog({
//     title:  "Blog3",
//     author:"me , DUwdaH2",
//     body:   "hey vsause1"
//  });

//  blog1.save(function(err , blog1){
//      if (err){
         
//          console.log(err);
         
//      }else{
         
//          console.log("it worked somehow");
//      }
     
//  });
 
 



// routes
app.get('/', function (req, res) {
  res.render("index");
});
app.get('/about', function (req, res) {
    res.render("about");
});
app.get('/services', function (req, res) {
    res.render("services");
});
app.get('/contact', function (req, res) {
    res.render("contact");
});
app.get('/blogs', function (req, res) {
    // find all the blogs
    Blog.find({} , function(err,blogs){
        if (err){
            console.log("errrr");
             console.log(err);
            
        }else{
        res.render("blog" ,{ blogs:blogs});
        }
        // .sort mehod 1 for the oldest and -1 for the newest THANKS STACKOVERFLOW
}).sort({date:-1});
        
    });
    
    
    app.get('/blogs/new', function(req, res) {
     
     res.render('new');
     
 });
 
 app.get('/blogs/:id', function (req, res) {
     
 Blog.findById(req.params.id,function(err ,Blog){
     
    if (err){
        console.log("from show id");
        console.log(err);
        res.redirect("/blogs");
    }else{
    res.render("show" , { Blog : Blog} );
    }
    });     
   
 });
 
 app.get('/blogs/:id/edit', function (req, res) {
     
 Blog.findById(req.params.id,function(err ,Blog){
     
    if (err){
        console.log("from edit id");
        console.log(err);
        res.redirect("/blogs");
    }else{
    res.render("edit" , { Blog : Blog });
    }
    });     
   
 });
 
//  here <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 app.put("/blogs/:id", function(req , res){
     
    Blog.findByIdAndUpdate(req.params.id, req.body.Blog ,function(err , Blog){
        
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
            
        }
        
    });
     
 });
    
 // saving the blogs   
 app.post("/blogs", function(req ,res){
     
     var title = req.body.title;
     var auther = req.body.auther;
     var body = req.body.body;
     var image = req.body.image;
    
     var newBlog = new Blog ({title : title , body : body , auther : auther , image : image });
     
     
    //  Blog.push(newBlog); doesn't work so .save is used 
    //  res.redirect("/blogs");
     
     
    newBlog.save(function(err,blog){
        if (err){
            console.log("come on");
            console.log(err);
            
        }else{
            
            console.log("added to database");
            res.redirect("/blogs");
             
             
        }
        
        
        
    });
    
    
    
 });
 
 app.delete("/blogs/:id", function(req , res){
     
     Blog.findByIdAndRemove(req.params.id , function(err){
         if (err){
         console.log(err);
         }else{
             console.log("We lost a POST :((")
             res.redirect("/blogs");
             
         }
     });
     
 });
    







app.listen(process.env.PORT, process.env.IP , function(req,res){
    console.log("server is on...");
});