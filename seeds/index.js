const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelper');

const Campground=require('../models/campground');
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB=async()=>{
    await Campground.deleteMany({});
   for(let i=0;i<300;i++)
    {
      const random1000=Math.floor(Math.random()*1000);
      const price=Math.floor(Math.random()*20)+10;
      const camp=new Campground({
        author: '665608067084a9959e07309d',
        location:`${cities[random1000].city},${cities[random1000].state}` ,
        title:`${sample(descriptors)},${sample(places)}`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores veroperferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
        price,
        geometry: {
          type: "Point",
          coordinates: [
              cities[random1000].longitude,
              cities[random1000].latitude,
          ]
      },
        images: [
          {
            url: 'https://res.cloudinary.com/dzzz4fcez/image/upload/v1718291744/YelpCamp/yfsur8ujpfhg6qyzfnfb.jpg',
            filename: 'YelpCamp/yfsur8ujpfhg6qyzfnfb',
          },
          {
            url: 'https://res.cloudinary.com/dzzz4fcez/image/upload/v1718291740/YelpCamp/qvea41hjugnb3ancqyzd.jpg',
            filename: 'YelpCamp/qvea41hjugnb3ancqyzd',
           
          }
        ]
      

       
    })
      await camp.save();
    }//here we are basically creating a Campgound collection inside our mongodp database
}
seedDB().then(() => {
    mongoose.connection.close();
})

