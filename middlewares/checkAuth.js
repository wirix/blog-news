import jwt from 'jsonwebtoken'

export const checkAuth = (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1]

	if (token) {
		try {
			const decoded = jwt.verify(token, 'secretKey')
			req.userId = decoded._id
			next()
		} catch (e) {
			return res.status(403).json({
				message: 'Нет доступа'
			})
		}
	} else {
		return res.status(403).json({
			message: 'Нет доступа'
		})
	}
}