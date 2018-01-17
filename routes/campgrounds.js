const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const middleware = require('../middleware/index')

router.get('/', (req, res) => {
	Campground.find({}, (err, campgrounds) => {
		if (err) {
			console.log(err)
		} else {
			res.render('campgrounds/index', { campgrounds: campgrounds, user: req.user })
		}
	})
})

router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('campgrounds/new.ejs')
})

router.get('/:id', (req, res) => {
	Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
		if (err || !campground) {
			req.flash('error', 'Campground not found')
			res.redirect('back')
			console.log(err)
		} else {
			console.log(campground)
			res.render('campgrounds/show', { campground: campground })
		}
	})
})

router.post('/', middleware.isLoggedIn, (req, res) => {
	let newCampground = {
		name: req.body.name,
		price: req.body.price,
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
			console.log('Campground Added')
			console.log(campground)
			res.redirect('/campgrounds')
		}
	})
})

router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		res.render('campgrounds/edit', {campground: campground})
	})
})

router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
		if (err) {
			console.log(err)
		} else {
			res.redirect(`/campgrounds/${campground._id}`)
		}
	})
})

router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, err => {
		if (err) {
			console.log(err)
		} else {
			res.redirect('/campgrounds')
		}
	})
})

module.exports = router