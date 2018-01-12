const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/yelp_camp", {
    useMongoClient: true,
})

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String  
})
const Campground = mongoose.model("Campground", campgroundSchema)

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('landing')
})

app.get('/campgrounds', (req, res) => {
    Campground.find({},(err, campgrounds) => {
        if (err) {
            console.log(err)
        } else {
            res.render('campgrounds', {campgrounds: campgrounds})
        }
    })
})

app.post('/campgrounds', (req, res) => {
    let newCampground = {
        name: req.body.name,
        image: req.body.image
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

app.get('/campgrounds/new', (req, res) => {
    res.render('new.ejs')
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})