const express = require("express");
const bodyParser = require("body-parser");
var fs = require('fs');
const rentdata = require("./json/rentroom");
const coachinglist = require("./json/coachinglist");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');


app.get("/", function(req, res){
  res.render("index",{jsondata : rentdata});
});


app.get("/market", function(req, res){
  res.render("market.ejs");
});

app.get("/coachings", function(req, res){
  res.render("coachingReviews", {coachinglist: coachinglist});
});
app.get("/addcoaching", function(req, res){
  res.render("addcoaching", {coachinglist: coachinglist});
});

app.post("/addcoaching", function(req, res){
  let data ={
    name: req.body.name,
    location: req.body.location,
    course: req.body.course,
    contact: req.body.contact,
    email: req.body.email,
    rating : 0
  }
  coachinglist.unshift(data);
  fs.writeFile("json/coachinglist.json", JSON.stringify(coachinglist), err => {
    if (err) throw err; 
    console.log("Done writing"); 
  });
  res.redirect("success");
});

app.get("/viewcoaching", function(req, res){
  console.log(req.query.tag);
  res.render("viewcoaching", {coachinglist: coachinglist, i: req.query.tag});
});
app.post("/viewcoaching", function(req, res){
  let newrating=req.body.stars;
  let rating=coachinglist[req.body.index].rating;
  if(rating===0){
    coachinglist[req.body.index].rating=newrating;
  }
  else{
    coachinglist[req.body.index].rating=((newrating+rating)/2);
  }
  fs.writeFile("json/coachinglist.json", JSON.stringify(coachinglist, null,2), err => {
    if (err) throw err; 
    console.log("Done writing"); 
  });
  res.render("success");

})

app.get("/roomrent", function(req, res){
  res.render("roomRent" ,{jsondata : rentdata});
});
app.get("/addroom", function(req, res){
  res.render("addRoom");
});
app.post("/addroom", function(req,res){
  let data ={
    name: req.body.name,
    location: req.body.location,
    rent: req.body.rent,
    lightBill: req.body.checkbox,
    contact: req.body.contact,
    email: req.body.email
  }
  rentdata.unshift(data);
  console.log(rentdata);
  fs.writeFile("json/rentroom.json", JSON.stringify(rentdata), err => {
    if (err) throw err; 
    console.log("Done writing"); 
  });
  res.redirect("success");
});

app.get("/success", function(req, res){
  res.render("success");
});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});

