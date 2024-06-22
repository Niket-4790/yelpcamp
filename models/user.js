const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
//This is a Mongoose plugin that simplifies building username and password login with Passport. 
//It provides methods for hashing and storing passwords, as well as handling user authentication.

const UserSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});

UserSchema.plugin(passportLocalMongoose);
//The plugin automatically adds a username field to the schema.
//It stores a hashed version of the password instead of the plain text.
//Adds a salt field to enhance security when hashing passwords.
// Ensures usernames are unique.
//Provides methods such as setPassword, authenticate, and serializeUser for user management and authentication.
module.exports=mongoose.model('User',UserSchema);