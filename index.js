const e = require("express");
const express = require("express");
const math = require("mathjs");
const app = express();
const port = 3001;

const { initializeApp , cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
var serviceAccount = require("./key.json");
initializeApp({
	credential: cert(serviceAccount),
});
const db = getFirestore();

app.set("view engine","ejs");
app.use(express.static('public'));

app.get("/",(req,res)=>{
	res.send("WELCOME TO SECRETGLOW...know your skin,nourish your skin.");
});

app.get("/index",(req,res)=>{
	res.render("index");
});

app.get("/about", (req,res) => {
	res.render("about");
});
app.get("/aboutnav", (req,res) => {
	res.render("about");
})
app.get("/aboutWebsite", (req,res) => {
	res.render("home");
})

app.get("/home",(req,res)=>{
	res.render("home");
});
app.get("/homenav", (req,res) => {
	res.render("home");
})
app.get("/homesubmit", (req,res) => {
	res.render("signup");
})

app.get("/signup",(req,res)=>{
	res.render("signup");
});
app.get("/signupnav", (req,res) => {
	res.render("signup");
})
app.get("/signupsubmit",(req,res)=>{
	const name = req.query.name;
	const email = req.query.email;
	const phone = req.query.phone;
	const password = req.query.password;
	db.collection("Users").add({
		Name : name,
		Email : email,
		PhoneNumber : phone,
		Password : password,
	}).then(()=>{
		res.render("login");
	});
});

app.get("/login",(req,res)=>{
	res.render("login");
});
app.get("/loginnav", (req,res) => {
	res.render("login");
})
app.get("/loginsubmit",(req,res)=>{
	const email = req.query.email;
	const password = req.query.password;
	db.collection("Users")
	.where("Email","==",email)
	.where("Password","==",password)
	.get()
	.then((docs) => {
		if(docs.size > 0){
			res.render("products");
		}
		else{
			res.render("signup");
		}
	});
});

app.get("/products",(req,res)=>{
	res.render("products");
});
app.get("/productsnav", (req,res) => {
	res.render("products");
})

const a = [];
const cost = [];
var amount = 0;
app.get("/addToCart",(req,res)=>{
	const value = req.query.item;
	var c = req.query.cost;
	cost.push(c);
	c = math.evaluate(c.slice(0,c.length-2));
	amount = amount + c;
	a.push(value);
	res.render("products");
});
app.get("/cart",(req,res)=>{
	if(typeof(a) != "undefined"){
		db.collection("Cart").add({
			Cart : a,
			Cost : cost,
			TotalCost : amount,
		}).then(()=>{
			res.render("cart",{productsData : a, amount : amount, cost : cost});
		});
	}
});
app.get("/cartnav", (req,res) => {
	res.render("cart");
});
app.get("/cartsubmit",(req, res)=>{
	res.render("contact");
});

app.get("/ordersubmit",(req,res)=>{
	res.render("contact");
});

app.get("/contactnav", (req,res) => {
	res.render("contact");
})
app.get("/contact",(req,res)=>{
	res.render("contact");
});
app.get("/contactsubmit",(req,res)=>{
	const name = req.query.name;
	const email = req.query.email;
	const phone = req.query.phone;
	const review = req.query.review;
	db.collection("Feedback").add({
		Name : name,
		Email : email,
		PhoneNumber : phone,
		Feedback : review,
	}).then(()=>{
		res.render("thankyou");
	});
});

app.get("/thankyou",(req,res)=>{
	res.render("thankyou");
});

app.get("/thankyousubmit", (req,res) => {
	res.render("index");
})
app.listen(port,()=>{
	console.log(`Server is running on Port Number: http://localhost:${port}`);
});