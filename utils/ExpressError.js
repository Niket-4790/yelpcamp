class ExpressError extends Error{
    constructor(message,statusCode){
        super();
        this.message=message;
        this.statusCode=statusCode;
    }
}
module.exports=ExpressError;
//This code defines a custom error class called ExpressError that extends the built-in Error class in JavaScript.
//this class aims to create more specific and meaningful error objects that can be used in an Express.js application.
