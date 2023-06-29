import { Router } from 'express';
import {
	createUser,
	loginUser,
	getAllCourses,
	purchaseCourse,
	getPurchasedCourses,
} from '../controllers/userController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = Router();

// POST /users/signup
router.post('/signup', async (req, res) => {
	try {
		const { username, password } = req.body;
		const { message, token } = await createUser(username, password);
		res.json({ message, token });
	} catch (error) {
		res.status(500).json({ error: 'Failed to create user account' });
	}
});

// POST /users/login
router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.headers;
		const { message, token } = await loginUser(username, password);
		res.json({ message, token });
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
		const purchasedCourses = await getPurchasedCourses();
		res.json({ purchasedCourses });
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch purchased courses' });
	}
});

export default router;
