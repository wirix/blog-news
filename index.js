import express from 'express'
import multer from 'multer'
import cors from 'cors'
import mongoose from 'mongoose'
import { registerValidator, loginValidator } from './validations/auth.validation.js'
import { checkAuth } from './middlewares/checkAuth.js'
import { validationErrors } from './middlewares/validationErrors.js'
import { UserController, PostController } from './controllers/index.js'
import { postCreateValidator } from './validations/post.validation.js'

const app = express()
const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads') // не получает никаких и ошибок и загружает файлы в папку uploads (когда файл будет загружаться, эта фия вернет путь этого файла)
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	}
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
// express нужно обьяснить что есть статичные файлы в спей папке
app.use('/uploads', express.static('uploads')) // express.static('uploads') есть ли в этой папке что я передаю (понимает что я передаю get запрос на получение статичного файла)


app.post('/auth/login', loginValidator, validationErrors, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)
app.post('/auth/register', registerValidator, validationErrors, UserController.register)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `uploads/${req.file.originalname}`
	})
})

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidator, validationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, validationErrors, PostController.remove);
app.patch(
	'/posts/:id',
	checkAuth,
	postCreateValidator,
	validationErrors,
	PostController.update,
);


app.listen(7777, async () => {
	await mongoose
		.connect('mongodb+srv://basketletterz:1234@cluster0.dxvjgb0.mongodb.net/blog?retryWrites=true&w=majority')
		.then(() => console.log('db ok connect'))
		.catch(() => console.log('db error connect'))
})
