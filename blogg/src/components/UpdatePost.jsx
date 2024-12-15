import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom"; 

const UpadatePost = () =>{
    const location = useLocation();
    const { blog_id } = location.state;
    const [username, setUsername] = useState('');

    const [blogPost, setBlogPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate(); 

    const [posts, setPosts] = useState({
        title: '',
        content: ''
    });

    const [jwtToken, setJwtToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    useEffect(() => {//obtaining accessToken from local storage
    const accessToken = localStorage.getItem('access');
    const storedRefreshToken = localStorage.getItem('refresh');
    
    if (accessToken) {
        setJwtToken(accessToken);
    }

    if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
    } else {
        console.warn('No refresh token found');
    }

    },[jwtToken]);

    const refreshAccessToken = async () => {//obtaining new accessToken
        try {
            const response = await fetch(`https://sdcblogproject.onrender.com/refresh_token/${refreshToken}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                }    
            });
    
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access', data.access);
                return data.access;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    };
        
    
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

    const handlePostInputChange = (event) => {
        const { name, value } = event.target;
        setPosts((preVal) => {
            return {
            ...preVal,
            [name]: value
            };
        });
    };

    //updating post using author_id
    const addEvent = async () => {
        try {
            const formData = new FormData();
            formData.append('title', posts.title);
            formData.append('content', posts.content);
            formData.append('author_id', blogPost.author_id);
            
            let currentToken = jwtToken;
            const response = await fetch(`https://sdcblogproject.onrender.com/api/blogs/${blog_id}/`, {
                method: 'PUT',
                headers: {
                'Authorization': `Bearer ${currentToken}`,
                },
                body: formData
            });
    
            if (response.status === 401) {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    const retryResponse = await fetch(`https://sdcblogproject.onrender.com/api/blogs/${blog_id}/`, {
                        method: 'PUT',
                        headers: {
                        'Authorization': `Bearer ${newToken}`
                    },
                    body: formData
                    });
    
                    const data = await retryResponse.json();
                    if (retryResponse.ok) {
                        console.log("Updated Post successfully")
                        setTimeout(() => {
                            navigate(-1); // Delay navigation slightly if needed to show success message
                        }, 1000);
                    } else {
                    console.error('Failed to update post:', data);
                    }
                } else {
                    console.error('Authentication completely failed');
                }
            } else {
                const data = await response.json();
                if (response.ok) {
                    console.log("Updated Post successfully")
                    setTimeout(() => {
                        navigate(-1); // Delay navigation slightly if needed to show success message
                    }, 1000);
                } else {
                console.error('Failed to create post:', data);
                }
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
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
                    <input
                        type='text'
                        name='title'
                        value={posts.title}
                        placeholder={blogPost.title}
                        onChange={handlePostInputChange}
                        style={{ 
                            width: '98%', 
                            margin: '10px', 
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />

                    <textarea
                        name='content'
                        value={posts.content}
                        placeholder={blogPost.content}
                        onChange={handlePostInputChange}
                        style={{ 
                            width: '98%', 
                            margin: '10px', 
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            minHeight: '100px',
                        }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', margin:'15px' }}>
                        <button
                            onClick={addEvent}
                            className='butt'
                            style={{
                            backgroundColor: 'white',
                            color: 'rgb(243, 158, 67)',
                            border: '1px solid rgb(243, 158, 67)',
                            borderRadius: '5px',
                            padding: '5px 10px'
                            }}
                        >
                            Update Post
                        </button>
                    </div>
                </div>
            )}

        </>
    );
}

export default UpadatePost;