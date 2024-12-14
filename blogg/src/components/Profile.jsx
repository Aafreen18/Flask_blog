import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DisplayPost from './DisplayPost';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, username, userId } = location.state || {};

  const [addItems, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
  
  useEffect(() => {//getting all blogs
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://sdcblogproject.onrender.com/api/blogs/', {
          method: 'GET'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();
        setItems(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDeletePost = async (blogId) => {
  try {
    const response = await fetch(`https://sdcblogproject.onrender.com/api/blogs/${blogId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        const retryResponse = await fetch(`https://sdcblogproject.onrender.com/api/blogs/${blogId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`
          }
        });

        if (!retryResponse.ok) {
          throw new Error('Failed to delete the blog post after retrying.');
        }
      } else {
        throw new Error('Failed to refresh the token.');
      }
    } else if (!response.ok) {
      throw new Error('Failed to delete the blog post.');
    }
        
    setItems((prevItems) => prevItems.filter((item) => item.id !== blogId));
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Failed to delete the post. Please try again.');
    }
  };


  const handleUpdatePost = (blog) => {
    // Navigate to update page with blog details
    navigate('/update-post', { 
      state: { 
        blog: blog, 
        userId: userId 
      } 
    });
  };

  const styles = {
    titleContainer: {
      marginTop: '10px',
      padding: '10px',
      backgroundColor: 'ORANGE',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'center'
    },
    title: {
      fontSize: '2.5em',
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      marginBottom: '10px',
      fontFamily: "'Roboto', sans-serif",
      animation: 'fadeIn 1.5s ease-out',
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '10px'
    }
  };

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* profile heading */}
      <div className="profile-card">
        <div className="profile-header">
          <h2>Profile</h2>
        </div>
        <div className="profile-details">
          <p className="username fw-bold">Username: <span className='fw-medium' style={{color:'orange'}}>{username}</span></p>
          <p className="email fw-bold">Email: <span className='fw-medium' style={{color:'orange'}}>{email}</span></p>
        </div>
      </div>

      {/*your post heading  */}
      <div style={styles.titleContainer}>
        <h1 style={styles.title}>YOUR POSTS!</h1>
      </div>

      <div
        className="writtenNotes"
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent:'space-evenly',
          marginBottom: '15px',          
        }}
       >
        {addItems
          .filter((item) => item.author_id === userId)
          .map((curEle, idx) => (
            <div key={idx} style={{backgroundColor:'bisque' ,borderRadius:'10px', margin:'10px', padding:'10px'}}>
              <DisplayPost
                title={curEle.title}
                content={curEle.content}
                images={curEle.images}
                idAuthor={curEle.author_id}
                blog_id={curEle.id}
                likes={curEle.likes}
              />
              <div style={styles.actionButtons}>
                <button 
                  onClick={() => handleUpdatePost(curEle.id)}
                  className='butt'
                  style={{
                    backgroundColor: 'white',
                    color: 'rgb(243, 158, 67)',
                    border: '1px solid rgb(243, 158, 67)',
                    borderRadius: '5px',
                    padding: '5px 10px'
                  }}
                >
                  Update
                </button>
                <button 
                  onClick={() => handleDeletePost(curEle.id)}
                  className='butt'
                  style={{
                    backgroundColor: 'white',
                    color: 'rgb(243, 158, 67)',
                    border: '1px solid rgb(243, 158, 67)',
                    borderRadius: '5px',
                    padding: '5px 10px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Profile;