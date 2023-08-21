import { body } from 'express-validator'

export const postCreateValidator = [
	body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
	body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
	body('tags', 'Неверный формат тэгов').optional().isArray(),
	body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]

export const postUpdateValidator = [
	body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
	body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
	body('tags', 'Неверный формат тэгов').optional().isArray(),
	body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]