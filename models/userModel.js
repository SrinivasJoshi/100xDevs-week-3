const { Schema, model } = require('mongoose');

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	purchasedCourses: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Course',
		},
	],
});

const User = model('User', userSchema);

module.exports = User;
