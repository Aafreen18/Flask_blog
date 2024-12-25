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

                    {/* Title Section */}
                    <div style={{ 
                        padding: '10px',
                        backgroundColor:'lightgrey', 
                        borderTop: blogPost.images ? '1px solid #f0f0f0' : 'none'
                        }}>
                        <h3 style={{ 
                        marginTop: 0, 
                        marginBottom: '10px', 
                        fontSize: '27px', 
                        color: 'black',
                        fontFamily:'cursive',
                        fontWeight:'bold',
                        textAlign:'justify'
                        }}>
                        {blogPost.title}
                        </h3>
                        
                    </div>

                    {blogPost.images && blogPost.images.length > 0 ? (
                        <div style={{ display: 'flex' }}>
                            {/* Image Section */}
                            <div
                                style={{
                                    flex: '0 0 70%',
                                    position: 'relative',
                                    height: '450px', // Ensure same height as comments section
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    src={getValidImageUrl(blogPost.images[currentImageIndex])}
                                    alt={`Post ${currentImageIndex + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%', // Leaves room for interaction section
                                        objectFit: 'contain',
                                    }}
                                    onError={(e) => { e.target.src = '/path/to/placeholder-image.jpg'; }}
                                />
                                {/* Navigation Buttons */}
                                {blogPost.images.length > 1 && (
                                    <>
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

                                {/* Like and Comments Section */}
                                <div
                                    className="blog-interaction"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '10px 20px',
                                        boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                    >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            color: '#333',
                                            fontWeight: 'bold',
                                        }}
                                        >
                                        <span>{blogPost.likes} <i className="fa-solid fa-heart" style={{color:'orange'}}></i></span>
                                        <span>{blogPost.comments.length} <i class="fa-solid fa-comment" style={{color:'orange'}}></i></span>
                                    </div>
                                    
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div
                                style={{
                                    flex: '0 0 30%',
                                    backgroundColor: 'rgb(243, 158, 67)',
                                    padding: '10px',
                                    overflowY: 'auto',
                                    maxHeight: '450px',
                                    height: '450px', // Matches height with the image div
                                }}
                            >
                                <h3>All Comments</h3>
                                {blogPost.comments && blogPost.comments.length > 0 ? (
                                    blogPost.comments.map((comment, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                marginBottom: '10px',
                                                padding: '10px',
                                                backgroundColor: '#fff',
                                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                            }}
                                        >
                                            {comment.comment_text}
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ color: 'white', textAlign: 'center' }}>No Comments Available!</div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                width: '100%',
                                height: '250px',
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#aaa',
                            }}
                        >
                            No Images Available
                        </div>
                    )}

                    {/* Content Section */}
                    <div style={{ 
                        padding: '15px', 
                        borderTop: blogPost.images ? '1px solid #f0f0f0' : 'none'
                        }}>
                        
                        <p style={{ 
                        color: '#495057', 
                        lineHeight: '1.4',
                        textAlign:'justify',
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