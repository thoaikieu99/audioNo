const AppError = require("../ultils/appErrors");

const ValidatioDB = (error) => {
    const message = Object.values(error.errors).map(ul => ul.message)
    return new AppError(message, 400)
}
const tokenEro = () => {
    return new AppError("Invalid token, please log in again!", 401);
}
const extoke = () => {
    return new AppError("Your token has expired! please log in again", 401);
}
const uniquye = (error) => {

    const message = `Duplicate entry ${Object.values(error.errors).map(ul => ul.value)}`
    return new AppError(message, 400)
}


const sendErrorPro = (err, res) => {
    if (err.isOperational) {

        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        console.error("ERROR ", err)
        res.status(500).json({
            status: "error",
            message: "Something went very wrong!"
        })
    }
}
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

module.exports = (err, req, res, next) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    }
    if (process.env.NODE_ENV === "production") {

        let errorr = err;
        if (err.name === "SequelizeUniqueConstraintError") errorr = uniquye(err)
        if (err.name === "SequelizeValidationError") errorr = ValidatioDB(err)
        if (err.name == "JsonWebTokenError") errorr = tokenEro(err)
        if (err.name == 'TokenExpiredError') errorr = extoke(err)
        sendErrorPro(errorr, res)

    }

}