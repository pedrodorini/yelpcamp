let express = require("express")
let app = express()
let bodyParser = require("body-parser")
let campgrounds = [
    {name: 'Salmon Creek', image: "https://farm3.staticflickr.com/2353/2069978635_2eb8b33cd4.jpg"},
    {name: 'Granite Hill', image: "https://farm3.staticflickr.com/2535/3823437635_c712decf64.jpg"},
    {name: 'Goat\'s Rest', image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"}
]

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('landing')
})

app.get('/campgrounds', (req, res) => {
    res.render('campgrounds', {campgrounds: campgrounds})
})

app.post('/campgrounds', (req, res) => {
    let newCampground = {
        name: req.body.name,
        image: req.body.image
    }
    campgrounds.push(newCampground)
    res.redirect('/campgrounds')
})

app.get('/campgrounds/new', (req, res) => {
    res.render('new.ejs')
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})