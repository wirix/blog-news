import { validationResult } from 'express-validator'
import { UserModel } from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)

		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден'
			})
		}

		const { passwordHash, ...userData } = user._doc

		res.json({
			...userData
		})
	} catch (e) {
		return res.status(500).json({
			message: 'Не удалось получить данные аккаунта'
		})
	}
}

export const login = async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		const { email, password } = req.body

		const user = await UserModel.findOne({ email })

		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден'
			})
		}

		const isEqual = await bcrypt.compare(password, user.passwordHash)
		if (!isEqual) {
			return res.status(400).json(errors.array())
		}

		const token = jwt.sign(
			{
				_id: user._id
			},
			'secretKey',
			{
				expiresIn: '30d'
			}
		)

		user.token = token
		await user.save()

		const { passwordHash, ...userData } = user._doc

		res.json({
			...userData,
			token
		})
	} catch (e) {
		console.log(e)
	}
}

export const register = async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		const { email, password, fullName, avatarUrl } = req.body
		const hash = await bcrypt.hash(password, 3)

		const doc = new UserModel({
			email,
			passwordHash: hash,
			fullName,
			avatarUrl
		})

		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id
			},
			'secretKey',
			{
				expiresIn: '30d'
			}
		)

		const { passwordHash, ...userData } = user._doc

		res.json({ ...userData, token })
	} catch (err) {
		res.status(500).json({
			message: 'Не удалось зарегистрироваться'
		})
	}
}