const jwt = require('jsonwebtoken');
const secretKey = 'secret1232';

const authenticateAdmin = (req, res, next) => {
	// Extract the token from the Authorization header
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	try {
		// Verify the token using the secret key
		const decoded = jwt.verify(token, secretKey);

		// Attach the decoded token payload to the request object for future use
		req.admin = decoded.admin;

		// Call the next middleware or route handler
		next();
	} catch (error) {
		res.status(401).json({ error: 'Unauthorized' });
	}
};

const authenticateUser = (req, res, next) => {
	// Extract the token from the Authorization header
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	try {
		// Verify the token using the secret key
		const decoded = jwt.verify(token, secretKey);

		// Attach the decoded token payload to the request object for future use
		req.user = decoded.user;

		// Call the next middleware or route handler
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({ error: 'Unauthorized' });
	}
};

module.exports = { authenticateAdmin, authenticateUser };
