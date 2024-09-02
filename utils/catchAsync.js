module.exports=func=>{
    return(req,res,next)=>{
        func(req,res,next).catch(next);
    }
}
//This code provides a convenient way to handle errors in asynchronous Express route handlers.
//By wrapping route handlers with this function, you ensure that any errors that occur in those handlers are automatically passed to the Express error-handling middleware.
//This reduces the need for repetitive try-catch blocks in your asynchronous route handlers, leading to cleaner and more maintainable code.
