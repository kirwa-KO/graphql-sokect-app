const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');

module.exports = {
	// hello () {
	//     return {
	//         text: 'Hello World..!!',
	//         views: 12345
	//     };
	// }
	createUser: async function({ userInput }, req) {
		const errors = [];
		if (!validator.isEmail(userInput.email))
			errors.push('Invalid Email..!!!');
		if (validator.isEmpty(userInput.password) ||
			!validator.isLength(userInput.password, { min: 5 }))
			errors.push('Password is to short..!!');
		if (errors.length > 0)
		{
			const error = new Error('Invalid Input..!!');
			error.data = errors;
			error.code = 422;
			throw error;
		}

		const existingEmail = await User.findOne({ email: userInput.email });
		if (existingEmail) {
			const error = new Error('Email Already Exist..!!');
			throw error;
		}
		const hashedPw = await bcrypt.hash(userInput.password, 12);
		const user = new User({
			email: userInput.email,
			name: userInput.name,
			password: hashedPw,
		});
        const createdUser = await user.save();
		return {...createdUser._doc, _id: createdUser._id.toString() }
	}
};