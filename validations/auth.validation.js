import { body } from 'express-validator'

export const registerValidator = [
	body('email', 'Неверный формат почты').isEmail(),
	body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 8, max: 32 }),
	body('fullName', 'Укажите имя').isLength({ min: 3, max: 15 }),
	body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL() // .optional() если придет то проверь
]