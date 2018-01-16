const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const passport = require('passport')
const LocalStrategy = require('passport-local')
const Campground = require('./models/campground')
const Comment = require('./models/comment')
const User = require('./models/user')
const seedDB = require('./seeds')

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/yelp_camp", {
	useMongoClient: true,
})
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + "/public"))

seedDB()

app.use(require('express-session')({
	secret: 's3cr3t',
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
	res.locals.user = req.user
	next()
})

app.get('/', (req, res) => {
	res.render('landing')
})
app.get('/campgrounds', (req, res) => {
	Campground.find({}, (err, campgrounds) => {
		if (err) {
			console.log(err)
		} else {
			res.render('campgrounds/index', { campgrounds: campgrounds, user: req.user })
		}
	})
})
app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new.ejs')
})
app.get('/campgrounds/:id', (req, res) => {
	Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
		if (err) {
			console.log(err)
		} else {
			console.log(campground)
			res.render('campgrounds/show', { campground: campground })
		}
	})
})
app.post('/campgrounds', (req, res) => {
	let newCampground = {
		name: req.body.name,
		image: req.body.image,
		description: req.body.description
	}
	Campground.create(newCampground, (err, campground) => {
		if (err) {
			console.log(err)
		} else {
			console.log("Campground Added")
			console.log(campground)
			res.redirect('/campgrounds')
		}
	})
})
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err)
		} else {
			res.render('comments/new', { campground: campground })
		}
	})
})
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err)
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					console.log(err)
				} else {
					campground.comments.push(comment._id)
					campground.save()
					res.redirect(`/campgrounds/${campground._id}`)
				}
			})
		}
	})
})
app.get('/register', (req, res) => {
	res.render('register')
})
app.post('/register', (req, res) => {
	let newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			console.log(err)
			return res.render('register')
		}
		passport.authenticate('local')(req, res, () => {
			res.redirect('/campgrounds')
		}) 
	})
})
app.get('/login', (req, res) => {
	res.render('login')
})
app.post('/login', passport.authenticate('local', {
	successRedirect: '/campgrounds',
	failureRedirect: '/login'
}))
app.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/campgrounds')
})
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/login')
}
app.listen(3000, () => {
		console.log('Server is running on port 3000')
})