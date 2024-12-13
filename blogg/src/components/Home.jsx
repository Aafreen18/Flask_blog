import React, { useState, useEffect } from 'react';
import DisplayPost from './DisplayPost';
import { useLocation } from 'react-router-dom';
import CreatePost from './CreatePost';
import Navbar from './Navbar';

const Home = () => {
  const location = useLocation();
  const [addItems, setItems] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [jwtToken, setJwtToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [authorId, setAuthorId] = useState(null);

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

    if (jwtToken) {
      fetchBlogs();
    }
  }, [jwtToken]);

  useEffect(() => {
    if (location.state) {
      setUsername(location.state.username || '');
      setEmail(location.state.email || '');
    }

    const accessToken = localStorage.getItem('access');
    const storedRefreshToken = localStorage.getItem('refresh');
    const storedAuthorId = localStorage.getItem('author_id');

    if (accessToken) {
      setJwtToken(accessToken);
    }

    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    } else {
      console.warn('No refresh token found');
    }

    if (storedAuthorId) {
      setAuthorId(storedAuthorId);
    } else {
      console.warn('No author_id found');
    }
  }, [location.state]);

  return (
    <>
      <Navbar username={username} email={email} />
      
      {jwtToken && refreshToken ? (
        <CreatePost
          jwtToken={jwtToken}
          refreshToken={refreshToken}
          username={username}
          authorId={authorId}
        />
      ) : (
        <p>Loading...</p>
      )}

      <div
        className="writtenNotes"
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '15px',
        }}
      >
        {addItems.map((curEle, idx) => (
          <DisplayPost
            key={curEle.key} 
            title={curEle.title}
            content={curEle.content}
            images={curEle.images}
            id={idx}
            username={curEle.username}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
