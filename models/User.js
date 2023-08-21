import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	passwordHash: {
		type: String,
		required: true
	},
	fullName: {
		type: String,
		required: true
	},
	avatarUrl: String,
}, {
	timestamps: true
})

export const UserModel = model('User', UserSchema)