export const notFound = (req, res, next) => {
	console.log(`Error at middlware ${req}`);
	const error = new Error(`Not found - ${req.originalUrl} `);
	res.status(404);
	next(error);
};

export const errorhandler = (req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		message: errorhandler.message,
		stack: process.env.NODE_ENV === "production" ? null : err.stack,
	});
	return res;
};
