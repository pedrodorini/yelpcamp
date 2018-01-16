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

router.get('/new', (req, res) => {
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

router.post('/', (req, res) => {
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
module.exports = router