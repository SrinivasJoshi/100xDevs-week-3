const Router = require('express').Router;
const {
	createUser,
	loginUser,
	getAllCourses,
	purchaseCourse,
	getPurchasedCourses,
} = require('../controllers/userController');

const { authenticateUser } = require('../middleware/authMiddleware');

const router = Router();

// POST /users/signup
router.post('/signup', async (req, res) => {
	try {
		const { username, password } = req.body;
		const { message, token, userId } = await createUser(username, password);
		res.json({ message, token, userId });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Failed to create user account' });
	}
});

// POST /users/login
router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.headers;
		const { message, token, userId } = await loginUser(username, password);
		res.json({ message, token, userId });
	} catch (error) {
		res.status(500).json({ error: 'Failed to authenticate user' });
	}
});

// Protected routes for authenticated users
router.use(authenticateUser);

// GET /users/courses
router.get('/courses', async (req, res) => {
	try {
		const courses = await getAllCourses();
		res.json({ courses });
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch courses' });
	}
});

// POST /users/courses/:courseId
router.post('/courses/:courseId', async (req, res) => {
	try {
		const { courseId } = req.params;
		await purchaseCourse(courseId);
		res.json({ message: 'Course purchased successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to purchase course' });
	}
});

// GET /users/purchasedCourses
router.get('/purchasedCourses', async (req, res) => {
	try {
		const userId = req.body.userId;
		const purchasedCourses = await getPurchasedCourses(userId);
		res.json({ purchasedCourses });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Failed to fetch purchased courses' });
	}
});

module.exports = router;
