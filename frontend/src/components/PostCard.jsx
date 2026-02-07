import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useState } from 'react';
import API from '../api';

const PostCard = ({ post, onUpdate }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isLiked = post.likes.includes(user?.username);
    const [showAllComments, setShowAllComments] = useState(false);
    const [commentText, setCommentText] = useState('');

    const handleLike = async () => {
        try {
            const { data } = await API.post(`/posts/like/${post._id}`);
            onUpdate(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            const { data } = await API.post(`/posts/comment/${post._id}`, { text: commentText });
            onUpdate(data);
            setCommentText('');
            setShowAllComments(true);
        } catch (err) {
            console.error(err);
        }
    };

    const displayedComments = showAllComments ? post.comments : post.comments.slice(0, 2);

    return (
        <div className="post-card">
            <div className="post-header">
                <img src={post.avatar || 'https://via.placeholder.com/40'} alt="avatar" className="avatar" />
                <div className="post-user-info">
                    <h4>{post.username}</h4>
                    <span>{new Date(post.createdAt).toLocaleString()}</span>
                </div>
                <button style={{ marginLeft: 'auto', background: '#e7f3ff', color: '#1877f2', padding: '5px 15px', borderRadius: '15px' }}>Follow</button>
            </div>

            <div className="post-content">
                <p>{post.content}</p>
            </div>

            {post.imageUrl && <img src={post.imageUrl} alt="post" className="post-image" />}



            <div className="post-actions">
                <button className={`action-btn ${isLiked ? 'active' : ''}`} onClick={handleLike}>
                    <Heart size={20} fill={isLiked ? 'var(--primary)' : 'none'} />
                    {post.likes.length}
                </button>
                <button className="action-btn">
                    <MessageCircle size={20} />
                    {post.comments.length}
                </button>
                <button className="action-btn">
                    <Share2 size={20} />
                    0
                </button>
            </div>

            {/* Likes - Instagram Style */}
            {post.likes.length > 0 && (
                <div style={{ padding: '0 15px', fontSize: '14px', fontWeight: '600', marginTop: '8px' }}>
                    {post.likes.length === 1 ? (
                        <span>Liked by <span style={{ color: 'var(--primary)' }}>{post.likes[0]}</span></span>
                    ) : (
                        <span>
                            Liked by <span style={{ color: 'var(--primary)' }}>{post.likes[0]}</span>
                            {post.likes.length > 1 && ` and ${post.likes.length - 1} other${post.likes.length > 2 ? 's' : ''}`}
                        </span>
                    )}
                </div>
            )}

            {/* Comments - Instagram Style */}
            {post.comments.length > 0 && (
                <div style={{ padding: '8px 15px 0' }}>
                    {/* View all comments link */}
                    {post.comments.length > 2 && !showAllComments && (
                        <div
                            style={{
                                fontSize: '14px',
                                color: '#65676b',
                                cursor: 'pointer',
                                marginBottom: '8px'
                            }}
                            onClick={() => setShowAllComments(true)}
                        >
                            View all {post.comments.length} comments
                        </div>
                    )}

                    {/* Display comments inline */}
                    {displayedComments.map((comment, index) => (
                        <div key={index} style={{ fontSize: '14px', marginBottom: '6px' }}>
                            <span style={{ fontWeight: '600', marginRight: '6px' }}>
                                {comment.username}
                            </span>
                            <span>{comment.text}</span>
                        </div>
                    ))}

                    {/* Show less option */}
                    {showAllComments && post.comments.length > 2 && (
                        <div
                            style={{
                                fontSize: '14px',
                                color: '#65676b',
                                cursor: 'pointer',
                                marginTop: '4px'
                            }}
                            onClick={() => setShowAllComments(false)}
                        >
                            Show less
                        </div>
                    )}
                </div>
            )}

            {/* Add Comment Input - Instagram Style */}
            <div style={{
                borderTop: '1px solid var(--border)',
                marginTop: '10px',
                padding: '10px 15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleComment(e)}
                    style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px',
                        background: 'transparent'
                    }}
                />
                {commentText.trim() && (
                    <button
                        onClick={handleComment}
                        style={{
                            background: 'none',
                            color: 'var(--primary)',
                            fontWeight: '600',
                            fontSize: '14px',
                            padding: '0'
                        }}
                    >
                        Post
                    </button>
                )}
            </div>
        </div>
    );
};

export default PostCard;
