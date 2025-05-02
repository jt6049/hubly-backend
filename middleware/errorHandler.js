const errorHandler = (err, req,res, next) =>{
    if(req.headersSent){
        return next(err);
    }
    res.status(500).json({
        message:err.message,
        
    });
};

module.exports = errorHandler;

//To handle the default error of express js. if the header is sent then we want express to handle it.
