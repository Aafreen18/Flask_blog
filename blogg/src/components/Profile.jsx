import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DisplayPost from './DisplayPost';

const Profile = () => {
  const location = useLocation();
  const { email, username, userId } = location.state || {}; 
  const [addItems, setItems] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('https://sdcblogproject.onrender.com/api/blogs/', {
          method: 'GET'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        console.log(data);
        setItems(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchBlogs();
  });

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
      textAlign:'center'
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
      
      {/* blog posts */}
      </div>
        <div
          className="writtenNotes"
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: "center",
            marginBottom: '15px',
          }}
          >
          {addItems
            .filter((item) => item.author_id === userId)  
            .map((curEle, idx) => (  
            <DisplayPost
              key={idx} 
              title={curEle.title}
              content={curEle.content}
              images={curEle.images}
              idAuthor={curEle.author_id}
              blog_id={curEle.id}
              likes={curEle.likes}
            />
          ))}
        </div>
    </div>
    
  );
};

export default Profile;
