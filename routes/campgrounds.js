const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')

router.get('/', (req, res) => {
	Campground.find({}, (err, campgrounds) => {
		if (err) {
			console.log(err)
		} else {
			res.render('campgrounds/index', { campgrounds: campgrounds, user: req.user })
		}
	})
})

router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new.ejs')
})

router.get('/:id', (req, res) => {
	Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
		if (err) {
			console.log(err)
		} else {
			console.log(campground)
			res.render('campgrounds/show', { campground: campground })
		}
	})
})

router.post('/', isLoggedIn, (req, res) => {
	let newCampground = {
		name: req.body.name,
		image: req.body.image,
		description: req.body.description,
		author: {
			id: req.user._id,
			username: req.user.username
		}
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

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/login')
}
module.exports = router