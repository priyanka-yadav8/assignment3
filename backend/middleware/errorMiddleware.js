const errorHandler = (err, req, res, next) => {
    // console.log(res.statusCode, "StatusCode");
    // console.log(res.status, "status");
    console.error(err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

export { errorHandler };