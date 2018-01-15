const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Campground = require('./models/campground')
const Comment = require('./models/comment')
const seedDB = require('./seeds')

mongoose.connect("mongodb://localhost/yelp_camp", {
	useMongoClient: true,
})
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + "/public"))

seedDB()

app.get('/', (req, res) => {
	res.render('landing')
})
app.get('/campgrounds', (req, res) => {
	Campground.find({}, (err, campgrounds) => {
		if (err) {
			console.log(err)
		} else {
			res.render('campgrounds/index', { campgrounds: campgrounds })
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
app.get('/campgrounds/:id/comments/new', (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err)
		} else {
			res.render('comments/new', { campground: campground })
		}
	})
})
app.post('/campgrounds/:id/comments', (req, res) => {
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
app.listen(3000, () => {
		console.log('Server is running on port 3000')
})