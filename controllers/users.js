const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
//This method provided by passport-local-mongoose registers the user with the given password. 
//It handles password hashing and saves the user to the database. The await keyword is used because User.
//register returns a promise, and we need to wait for the operation to complete.
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}
//try { ... } catch (e) { ... }: This is a try-catch block. The code inside the try block is executed, 
//and if an error occurs, it is caught in the catch block where it can be handled appropriately.

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

//about storereturnto function
//This is likely a custom middleware function. 
//It might be used to store the URL the user was trying to access before being redirected to the login page. 
//This URL can then be used to redirect the user back to the intended page after successful login.

//passport.authenticat use
//This middleware uses Passport.js to authenticate the user using the 'local' strategy,
// which typically involves username and password authentication.

//failureFlash: true: Enables flash messages for failed login attempts. If authentication fails, a flash message will be displayed to the user.
//failureRedirect: '/login': If authentication fails, the user will be redirected to the '/login' page.

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}; 
//req.logout(function (err) { ... }): This method is provided by Passport.js to log out the user and end the session. It removes the req.user property and clears the login session.
