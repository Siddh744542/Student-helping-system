const express = require("express");
const bodyParser = require("body-parser");
var fs = require('fs');
const mongoose = require("mongoose");
const { stringify } = require("querystring");
const { log, Console } = require("console");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
mongoose.connect("mongodb://localhost:27017/StudentDB");



//HOme page 



app.get("/", function(req, res){
  Room.find(function(err, rentdata){
    if(err){
      console.log(err);
    }
    else {
      res.render("index" ,{jsondata : rentdata});
    }
  })
});



// Rent Room section



const roomDetailsSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true, "please check your data entery, name is not specified!!"]
  },
  location:{
    type:String,
    required:[true, "please check your data entery, location is not specified!!"]
  },
  rent:{
    type:Number,
    required:[true, "please check your data entery, rent is not specified!!"]
  },
  contact:{
    type:Number,
    required:[true, "please check your data entery, contact is not specified!!"]
  },
  email:{
    type:String,
    required:[true, "please check your data entery, email is not specified!!"]
  }
})

const Room = mongoose.model("room",roomDetailsSchema);

app.get("/roomrent", function(req, res){
  Room.find(function(err, rentdata){
    if(err){
      console.log(err);
    }
    else {
      res.render("roomRent" ,{jsondata : rentdata});
    }
  })
});
app.get("/addroom", function(req, res){
  res.render("addRoom");
});
app.post("/addroom", function(req,res){
  let newRoom = new Room({
    name: req.body.name,
    location: req.body.location,
    rent: req.body.rent,
    lightBill: req.body.checkbox,
    contact: req.body.contact,
    email: req.body.email
  })
  newRoom.save();
  res.redirect("success");
});



// Market section



const productSchema = new mongoose.Schema({
  productName:String,
  name:String,
  description:String,
  condition:String,
  price:Number,
  location:String,
  contact:Number,
  email:String
})
const Product = new mongoose.model("product",productSchema);

app.get("/market", function(req, res){
  Product.find(function(err, data){
    if(err){
      console.log(err);
    } else {
      res.render("market.ejs",{product: data});
    }
  })
  
});

app.get("/viewproduct", function(req, res){
  Product.find(function(err, data){
    if(err){
      console.log(err);
    } else {
      res.render("viewproduct.ejs",{product: data, i: req.query.tag});
    }
  })
})

app.get("/addproduct", function(req, res){
  res.render("addproduct.ejs");
});

app.post("/addproduct", function(req,res){
  let newproduct = new Product({
    productName: req.body.productName,
    name: req.body.name,
    description: req.body.description,
    condition: req.body.condition,
    price: req.body.price,
    location: req.body.location,
    contact: req.body.contact,
    email: req.body.email
  })
  newproduct.save();
  res.redirect("success");
})




// coaching section




const coachingSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true, "please check your data entery, name is not specified!!"]
  },
  location:{
    type:String,
    required:[true, "please check your data entery, location is not specified!!"]
  },
  course:{
    type:String
  },
  contact:{
    type:Number,
    required:[true, "please check your data entery, contact is not specified!!"]
  },
  email:{
    type:String,
    required:[true, "please check your data entery, email is not specified!!"]
  },
  rating:{
    type:Number,
    required:[true, "please check your data entery, rating is not specified!!"],
    min:0,
    max:5
  },
  ratings:[{rate:Number}]
})

const Coaching = new mongoose.model("coachingList",coachingSchema);
app.get("/coachings", function(req, res){
  Coaching.find(function(err, coachingData){
    if(err){
      console.log(err);
    }
    else {
      res.render("coachingReviews", {coachinglist: coachingData});
    }
  });
});
app.get("/addcoaching", function(req, res){
  Coaching.find(function(err, coachingData){
    if(err){
      console.log(err);
    } else {
      res.render("addcoaching", {coachinglist: coachingData});
    }
  });
});

app.post("/addcoaching", function(req, res){
  let newCoaching = new Coaching({
    name: req.body.name,
    location: req.body.location,
    course: req.body.course,
    contact: req.body.contact,
    email: req.body.email,
    rating : 0,
    ratings:[]
  })
  newCoaching.save();
  res.redirect("success");
});

app.get("/viewcoaching", function(req, res){
  console.log(req.query.tag);
  Coaching.find(function(err, coachingData){
    if(err){
      console.log(err);
    } else {
      res.render("viewcoaching", {coachinglist: coachingData, i: req.query.tag});
    }
  });
});

app.post("/viewcoaching", function(req, res){
  let newrating={rate:Number(req.body.stars)};
  const id= req.body.index;
  Coaching.findOneAndUpdate( {_id : id}, {$push: {ratings: newrating}}, function(err,success){
    if(err){
      console.log(err);
    }
    else{
      console.log(success);
    }
  });
  let sum=0;
  let numofratings=0;
  Coaching.findById(id,function(err, data){
    data.ratings.forEach(function(item){
      sum+=Number(item.rate);
    })
    numofratings=Number(data.ratings.length);
    const updatedrating = Math.round(sum/numofratings);
    Coaching.updateOne({_id :id},{ $set:{rating : updatedrating}}, function(err){
      if(err){
        console.log(err);
      } else {
        console.log("successfully updated");
      }
    });
  });
  res.render("success");

})


// Success page 
app.get("/success", function(req, res){
  res.render("success");
});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});

