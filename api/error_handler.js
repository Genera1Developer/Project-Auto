const errorHandler = (err, req, res, next) => {
    console.error('Global error handler:', err);

    if (err.status) {
        return res.status(err.status).send(err.message);
    }

    res.status(500).send('Internal Server Error');
};

module.exports = errorHandler;