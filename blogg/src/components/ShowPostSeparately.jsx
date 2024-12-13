import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

const ShowPostSeparately = () =>{
    const location = useLocation();
    const { blog_id } = location.state;
    const [username, setUsername] = useState('');

    const [blogPost, setBlogPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const getValidImageUrl = (imageUrl) => {
    return imageUrl; 
    };

    const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % blogPost.images.length);
    };

    const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + blogPost.images.length) % blogPost.images.length);
    };

    const cardStyle = {
        padding: '10px',
        textAlign: 'center',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease',
        background: 'linear-gradient(to right, #FF6B35 0%, #FF9F1C 100%)',
        height:'150px'
    };
    
    const avatarStyle = {
    width: '80px',
    height: '80px',
    margin: '0 auto 8px',
    borderRadius: '50%',
    background: 'linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.7) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.4rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    };

    const usernameStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#333'
    };

    useEffect(() => {
        const fetchBlogPost = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://sdcblogproject.onrender.com/api/blogs/${blog_id}/`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch blog post');
                }    
                const data = await response.json();
                console.log(data);
                
                setBlogPost(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching blog post:', err);
            } finally {
                setLoading(false);
            }
        };

        if (blog_id) {
            fetchBlogPost();
        }
    }, [blog_id]);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
            const response = await fetch(`https://sdcblogproject.onrender.com/get_username/${blogPost.author_id}`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            console.log(data["username : "]);
            setUsername(data["username : "]); 
           
            } catch (error) {
            console.error('Error fetching username:', error);
            setUsername(null);
            }
        }
        if (blogPost) {
            fetchUsername();
        }
    }, [blogPost]);

    return(
        <>
            <div style={cardStyle} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <div style={avatarStyle}>
                    { username.slice(0, 2).toUpperCase()}
                </div>
                <h1 style={usernameStyle}>{username}</h1>
            </div>

            {loading && <p>Loading blog post...</p>}
            
            {error && (
                <div style={{color: 'red', padding: '20px'}}>
                    {error}
                </div>
            )}

            {blogPost && (
            <div 
                style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                backgroundColor: 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                margin: '10px',
                position: 'relative'
                }}
                >
                {/* Header with AuthorId */}
                <div 
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 15px',
                    borderBottom: '1px solid #f0f0f0'
                    }}
                >
                <div 
                style={{ 
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: 'rgb(243, 158, 67)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginRight: '10px',
                    fontWeight: 'bold',
                    color: 'white'
                }}
                >
                {blogPost.author_id.charAt(0).toUpperCase()}
                </div>
                <h4 style={{ fontSize: '16px', color: "black", whiteSpace: "normal", wordBreak: "break-word" }}>{blogPost.author_id}</h4>
            </div>

            {/* Image Section */}
            {blogPost.images && blogPost.images.length > 0 ? (
                <div style={{ position: 'relative', padding: '10px' }}>
                <img
                    src={getValidImageUrl(blogPost.images[currentImageIndex])}
                    alt={`Post ${currentImageIndex + 1}`}
                    style={{
                    width: '100%',
                    height: '400px',
                    objectFit:'contain',
                    borderRadius: '8px',
                    }}
                    onError={(e) => { e.target.src = '/path/to/placeholder-image.jpg'; }}
                />
                {blogPost.images.length > 1 && (
                    <>
                    {/* Previous Button */}
                    <button
                        onClick={handlePrevImage}
                        style={{
                        position: 'absolute',
                        top: '50%',
                        left: '10px',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        }}
                    >
                        ‹
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={handleNextImage}
                        style={{
                        position: 'absolute',
                        top: '50%',
                        right: '10px',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        }}
                    >
                        ›
                    </button>
                    </>
                )}
                </div>
                ) : (
                <div style={{ 
                    width: '100%', 
                    height: '250px', 
                    backgroundColor: '#f0f0f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#aaa' 
                    }}>
                    No Images Available
                </div>
            )}

            {/* Content Section */}
            <div style={{ 
                padding: '15px', 
                borderTop: blogPost.images ? '1px solid #f0f0f0' : 'none'
            }}>
                <h3 style={{ 
                marginTop: 0, 
                marginBottom: '10px', 
                fontSize: '18px', 
                color: '#333' 
                }}>
                {blogPost.title}
                </h3>
                <p style={{ 
                margin: 0, 
                color: '#666', 
                lineHeight: '1.6' 
                }}>
                {blogPost.content}
                </p>
            </div>
            </div>
            )}
    
        </>
    );
}

export default ShowPostSeparately;