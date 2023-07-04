const Router = require('express').Router;
const {
	createAdmin,
	loginAdmin,
	createCourse,
	updateCourse,
	getAllCourses,
} = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const router = Router();

// POST /admin/signup
router.post('/signup', async (req, res) => {
	try {
		const { username, password } = req.body;
		const { message, token, adminId } = await createAdmin(username, password);
		res.json({ message, token, adminId });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Failed to create admin account' });
	}
});

// POST /admin/login
router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.headers;
		const { message, token, adminId } = await loginAdmin(username, password);
		res.json({ message, token, adminId });
	} catch (error) {
		res.status(500).json({ error: 'Failed to authenticate admin' });
	}
});

// Protected routes for authenticated admins
router.use(authenticateAdmin);

// POST /admin/courses
router.post('/courses', async (req, res) => {
	try {
		const { title, description, price, imageLink, published, adminId } =
			req.body;
		const { message, courseId } = await createCourse(
			title,
			description,
			price,
			imageLink,
			published,
			adminId
		);
		res.json({ message, courseId });
	} catch (error) {
		res.status(500).json({ error: 'Failed to create course' });
	}
});

// PUT /admin/courses/:courseId
router.put('/courses/:courseId', async (req, res) => {
	try {
		const { courseId } = req.params;
		const { title, description, price, imageLink, published } = req.body;
		const { message } = await updateCourse(
			courseId,
			title,
			description,
			price,
			imageLink,
			published
		);
		res.json({ message });
	} catch (error) {
		res.status(500).json({ error: 'Failed to update course' });
	}
});

// GET /admin/courses
router.get('/courses', async (req, res) => {
	try {
		const courses = await getAllCourses();
		res.json({ courses });
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch courses' });
	}
});

module.exports = router;
