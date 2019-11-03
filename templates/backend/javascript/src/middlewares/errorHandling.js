


module.exports = {

    defaultErrorHandler(err, req, res, next){

        const statusCode = err.statusCode || 500;
        const message = err.message || `Unexpected error`;

        return res.status(statusCode).json({ message })  
    },
    
    notFoundHandler(req, res){
        return res.status(404).json({ message: `${req.url} not found`})
    }
    
}