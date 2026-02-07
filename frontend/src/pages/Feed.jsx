import { useState, useEffect } from 'react';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import API from '../api';
import { Image, Send } from 'lucide-react';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchPosts = async () => {
        try {
            const { data } = await API.get('/posts');
            setPosts(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageUrl('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!content && !imageUrl && !imageFile) return;

        setUploading(true);
        try {
            let finalImageUrl = imageUrl;

            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const { data } = await API.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalImageUrl = `http://localhost:5000${data.imageUrl}`;
            }

            await API.post('/posts', { content, imageUrl: finalImageUrl });
            setContent('');
            setImageUrl('');
            setImageFile(null);
            setImagePreview('');
            fetchPosts();
        } catch (err) {
            console.error(err);
            alert('Failed to create post');
        } finally {
            setUploading(false);
        }
    };

    const updatePostInState = (updatedPost) => {
        setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
    };

    return (
        <div>
            <Header />
            <div className="container">
                {/* Tabs */}
                {/* <div className="tabs">
                    <button className="tab active">All Post</button>
                    <button className="tab">Most Liked</button>
                    <button className="tab">Most Commented</button>
                    <button className="tab">Most Shared</button>
                </div> */}

                {/* Create Post */}
                <div className="create-post">
                    <textarea
                        placeholder="What's on your mind?"
                        rows="2"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    {/* Image Preview */}
                    {imagePreview && (
                        <div style={{ position: 'relative', marginBottom: '10px' }}>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    maxHeight: '300px',
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                }}
                            />
                            <button
                                onClick={() => {
                                    setImageFile(null);
                                    setImagePreview('');
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    cursor: 'pointer',
                                    fontSize: '18px'
                                }}
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Image URL Input (only show if no file selected) */}
                    {!imageFile && (
                        <input
                            type="text"
                            placeholder="Write Here"
                            className="form-group"
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                    )}

                    <div className="create-post-footer">
                        <div style={{ color: 'var(--primary)', display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageSelect}
                            />
                            <label htmlFor="imageUpload" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <Image size={24} />
                            </label>
                            {imageFile && (
                                <span style={{ fontSize: '12px', color: '#666' }}>
                                    {imageFile.name}
                                </span>
                            )}
                        </div>
                        <button
                            className="post-submit-btn"
                            onClick={handlePost}
                            disabled={uploading}
                        >
                            <Send size={18} style={{ marginRight: '5px' }} />
                            {uploading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>

                {/* Feed */}
                <div className="feed">
                    {posts.map(post => (
                        <PostCard key={post._id} post={post} onUpdate={updatePostInState} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Feed;
