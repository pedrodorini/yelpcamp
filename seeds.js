const mongoose = require('mongoose')
const Campground = require('./models/campground')
const Comment = require('./models/comment')
const data = [
  { 
    name: 'Cloud\'s rest',
    image: 'https://static2.visitestonia.com/images/1726600/camp+small+4_.JPG',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur scelerisque commodo tellus quis gravida. Vivamus mollis enim a ligula rhoncus, vitae convallis massa fermentum. Donec ultricies rhoncus tellus, vulputate placerat nulla placerat quis. Nam aliquet sapien in efficitur dignissim. Vivamus at gravida massa, vulputate scelerisque mi.p'
  },
  {
    name: 'Goat\'s leap',
    image: 'https://i.ytimg.com/vi/EUU4KkezkI0/maxresdefault.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur scelerisque commodo tellus quis gravida. Vivamus mollis enim a ligula rhoncus, vitae convallis massa fermentum. Donec ultricies rhoncus tellus, vulputate placerat nulla placerat quis. Nam aliquet sapien in efficitur dignissim. Vivamus at gravida massa, vulputate scelerisque mi.'
  },
  {
    name: 'Marcy\'s creak',
    image: 'https://i.pinimg.com/originals/23/27/6d/23276da5302913cb5c82fba41b9fb92d.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur scelerisque commodo tellus quis gravida. Vivamus mollis enim a ligula rhoncus, vitae convallis massa fermentum. Donec ultricies rhoncus tellus, vulputate placerat nulla placerat quis. Nam aliquet sapien in efficitur dignissim. Vivamus at gravida massa, vulputate scelerisque mi.'
  }
]

function seedDB() {
  Campground.remove({}, err => {
    if (err) {
     console.log(err)
    } else {
     console.log('Removed Campgrounds')
     for (campground of data) {
       Campground.create(campground, (err, campground) => {
         if (err) {
           console.log(err)
         } else {
           console.log(`${campground.name} added!`)
           Comment.create({
             text: 'Nice place indeed',
             author: 'Bart'
           }, (err, comment) => {
             if (err) {
               console.log(err)
             } else {
               campground.comments.push(comment._id)
               campground.save()
               console.log('Created new comments')
             }
           })
         }
       })
     }
    }
  })
}
module.exports = seedDB