const router = require('express').Router();
const upload = require('../config/multer');
const auth = require('../middleware/auth');

router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
