import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { registerValidator } from './validations/auth.validation.js'
import { checkAuth } from './middlewares/checkAuth.js'
import * as UserController from './controllers/user-controller.js'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
	res.send('hello world')
})

app.post('/auth/login', UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)
app.post('/auth/register', registerValidator, UserController.register)

app.listen(7777, async () => {
	await mongoose
		.connect('mongodb+srv://basketletterz:1234@cluster0.dxvjgb0.mongodb.net/blog?retryWrites=true&w=majority')
		.then(() => console.log('db ok connect'))
		.catch(() => console.log('db error connect'))
})
