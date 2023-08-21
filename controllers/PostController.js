import { PostModel } from '../models/Post.js'

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags,
			imageUrl: req.body.imageUrl,
			user: req.userId
		})

		const post = await doc.save()
		res.json(post)
	} catch (e) {
		console.log(e)
		res.status(500).json({
			message: 'Не удалось создать статью'
		})
	}
}

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec()
		res.json(posts)
	} catch (e) {
		console.log(e)
		res.status(500).json({
			message: 'Не удалось зарегистрироваться'
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;
		await PostModel
			.findOneAndUpdate(
				{
					_id: postId,
				},
				{
					$inc: { viewsCount: 1 },
				},
				{
					returnDocument: 'after',
				}
			)
			.populate('user')
			.then((doc, err) => {
				if (err) {
					console.log(err);
					return res.status(500).json({
						message: "Failed to return the post",
					});
				}
				if (!doc) {
					return res.status(404).json({
						message: "Post not found",
					});
				}
				res.json(doc);
			})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось получить статьи',
		});
	}
};

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;
		await PostModel
			.findOneAndDelete({ _id: postId })
			.then((doc, err) => {
				if (err) {
					console.log(err);
					return res.status(500).json({
						message: "Failed to delete the post",
					});
				}
				if (!doc) {
					return res.status(404).json({
						message: "Post not found",
					});
				}
				res.json({
					success: true
				});
			})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось получить статьи',
		});
	}
};

export const update = async (req, res) => {
	const postId = req.params.id
	const { title, text, user, imageUrl, tags } = req.body

	await PostModel
		.updateOne(
			{
				_id: postId
			},
			{
				title,
				text,
				user,
				imageUrl,
				tags
			}
		)
	res.json({
		success: true,
	});
}
