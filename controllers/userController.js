const User = require('../models/userModel');
const Course = require('../models/courseModel');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY || 'secret1232';

// Create a new user account
const createUser = async (username, password) => {
	try {
		// Check if the username already exists
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			throw new Error('Username already exists');
		}

		// Create a new user
		const user = new User({ username, password });
		await user.save();

		// Generate a JWT token
		const token = generateToken(user._id);

		return { message: 'User created successfully', token, userId: user._id };
	} catch (error) {
		console.log(error);
		throw new Error('Failed to create user account');
	}
};

// Authenticate a user
const loginUser = async (username, password) => {
	try {
		// Check if the username and password match
		const user = await User.findOne({ username, password });
		if (!user) {
			throw new Error('Invalid username or password');
		}

		// Generate a JWT token
		const token = generateToken(user._id);

		return { message: 'Logged in successfully', token, userId: user._id };
	} catch (error) {
		throw new Error('Failed to authenticate user');
	}
};

// Get all courses
const getAllCourses = async () => {
	try {
		const courses = await Course.find({ published: true });
		return courses;
	} catch (error) {
		throw new Error('Failed to fetch courses');
	}
};

// Purchase a course
const purchaseCourse = async (userId, courseId) => {
	try {
		// add the courseId to the user's "purchasedCourses" array
		const user = await User.findById(userId);
		user.purchasedCourses.push(courseId);
		await user.save();
	} catch (error) {
		throw new Error('Failed to purchase course');
	}
};

// Get purchased courses
const getPurchasedCourses = async (userId) => {
	try {
		// Implement the logic to fetch the user's purchased courses
		// query the user's document and populate the purchased courses

		const user = await User.findById(userId).populate('purchasedCourses');
		if (!user) {
			throw new Error('User not found');
		}
		return user.purchasedCourses;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to fetch purchased courses');
	}
};

// Generate a JWT token
const generateToken = (userId) => {
	const token = jwt.sign({ userId }, secretKey, { expiresIn: '1d' });
	return token;
};

module.exports = {
	createUser,
	loginUser,
	getAllCourses,
	purchaseCourse,
	getPurchasedCourses,
};
