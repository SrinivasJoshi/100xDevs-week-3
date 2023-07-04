const Admin = require('../models/adminModel');
const Course = require('../models/courseModel');
const jwt = require('jsonwebtoken');
const secretKey = 'secret1232'; // Replace with your own secret key

// Create a new admin account
const createAdmin = async (username, password) => {
	try {
		// Check if the username already exists
		const existingAdmin = await Admin.findOne({ username });
		if (existingAdmin) {
			throw new Error('Username already exists');
		}

		// Create a new admin
		const admin = new Admin({ username, password });
		await admin.save();

		// Generate a JWT token
		const token = generateToken(admin._id);

		return { message: 'Admin created successfully', token, adminId: admin._id };
	} catch (error) {
		throw new Error('Failed to create admin account');
	}
};

// Authenticate an admin
const loginAdmin = async (username, password) => {
	try {
		// Check if the username and password match
		const admin = await Admin.findOne({ username, password });
		if (!admin) {
			throw new Error('Invalid username or password');
		}

		// Generate a JWT token
		const token = generateToken(admin._id);

		return { message: 'Logged in successfully', token, adminId: admin._id };
	} catch (error) {
		throw new Error('Failed to authenticate admin');
	}
};

// Create a new course
const createCourse = async (
	title,
	description,
	price,
	imageLink,
	published,
	adminId
) => {
	try {
		// Create a new course
		const course = new Course({
			title,
			description,
			price,
			imageLink,
			published,
			createdBy: adminId,
		});
		await course.save();

		return { message: 'Course created successfully', courseId: course._id };
	} catch (error) {
		console.log(error);
		throw new Error('Failed to create course');
	}
};

// Update an existing course
const updateCourse = async (
	courseId,
	title,
	description,
	price,
	imageLink,
	published
) => {
	try {
		// Update the course
		await Course.findByIdAndUpdate(courseId, {
			title,
			description,
			price,
			imageLink,
			published,
		});

		return { message: 'Course updated successfully' };
	} catch (error) {
		throw new Error('Failed to update course');
	}
};

// Get all courses
const getAllCourses = async () => {
	try {
		const courses = await Course.find({});
		return courses;
	} catch (error) {
		throw new Error('Failed to fetch courses');
	}
};

// Generate a JWT token
const generateToken = (adminId) => {
	const token = jwt.sign({ adminId }, secretKey, { expiresIn: '1d' });
	return token;
};

module.exports = {
	createAdmin,
	loginAdmin,
	createCourse,
	updateCourse,
	getAllCourses,
};
