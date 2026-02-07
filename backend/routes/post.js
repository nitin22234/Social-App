const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create Post
router.post('/', auth, async (req, res) => {
    try {
        const { content, imageUrl } = req.body;
        if (!content && !imageUrl) return res.status(400).json({ message: 'Post content or image is required' });

        const user = await User.findById(req.user);
        const newPost = new Post({
            userId: user._id,
            username: user.username,
            avatar: user.avatar,
            content,
            imageUrl
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Like/Unlike Post
router.post('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.user);

        if (post.likes.includes(user.username)) {
            post.likes = post.likes.filter(name => name !== user.username);
        } else {
            post.likes.push(user.username);
        }

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Comment on Post
router.post('/comment/:id', auth, async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.user);

        const newComment = {
            username: user.username,
            text
        };

        post.comments.push(newComment);
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
