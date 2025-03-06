const errorHandler = (err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
};

module.exports = errorHandler;