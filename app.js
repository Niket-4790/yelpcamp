if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');//This line imports the express module, which is a popular Node.js framework used for building web applications. The express function creates an instance of an Express application.
const path = require('path');//The path module is a built-in Node.js module that provides utilities for working with file and directory paths. It is used here to manage and resolve file paths in a cross-platform manner.
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');//method-override is a middleware that allows you to use HTTP verbs like PUT or DELETE where the client doesn't support it. 
//For example, HTML forms only support GET and POST, but this middleware allows you to override the method using a query parameter or a hidden input field.
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const helmet = require('helmet');


const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes=require('./routes/users');
const mongoSanitize = require('express-mongo-sanitize');
const { name } = require('ejs');
const MongoDBStore = require("connect-mongo")(session);

// const dbUrl = process.env.DB_URL;

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false
//    useNewUrlParser: true,
//    useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}))



const sessionConfig = {
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));//this should be before app.use(passport.session());
app.use(flash());
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dzzz4fcez/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
//This middleware initializes Passport for authentication in the Express application. It sets up Passport to be used with your application. This middleware must be included for Passport to work.
app.use(passport.session());
//This middleware is used to keep user login sessions persistent across multiple requests. It integrates Passport with the Express session, allowing Passport to use session-based authentication.
passport.use(new LocalStrategy(User.authenticate()));
//LocalStrategy: This is the strategy used to authenticate users with a username and password.
//This method is provided by the passport-local-mongoose plugin and handles the authentication of the user. It verifies the username and password against the stored credentials in the database.
passport.serializeUser(User.serializeUser());
//Serialization is the process of converting the user object into a format that can be stored in the session (typically, just the user ID).
passport.deserializeUser(User.deserializeUser());
//Deserialization is the process of converting the session data back into a user object.


app.use((req, res, next) => {
   
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
});
//below function will catches all type of routes for an undefined path
app.all('*',(req,res,next)=>{
   next(new ExpressError('page not found',404));

})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;//Extracts the statusCode property from the err object, defaulting to 500 if statusCode is not defined.
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'//Checks if the error object has a message propertyIf not, it sets a default error message: 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })//it will send the error message to page error.ejs in views
})//This middleware will be triggered whenever next is called with an error object

app.listen(3000,()=>{
    console.log('serving on port 3000');
})//this code is simply to start thr server on a local host 3000
