const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const Campground = require('./models/campground')
const Comment = require('./models/comment')
const User = require('./models/user')
const seedDB = require('./seeds')
const campgroundRoutes = require('./routes/campgrounds')
const commentRoutes = require('./routes/comments')
const indexRoutes = require('./routes/index')
const methodOverride = require('method-override')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://camp:yelpcamp@ds127883.mlab.com:27883/yelpcamp', {
	useMongoClient: true,
})

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + "/public"))
app.use(methodOverride('_method'))
app.use(flash())

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
	res.locals.error = req.flash('error')
	res.locals.success = req.flash('success')
	next()
})

app.use(indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)

app.listen(3000, () => {
		console.log('Server is running on port 3000')
})