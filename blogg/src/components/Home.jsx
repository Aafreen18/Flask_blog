import React, { useState, useEffect } from 'react';
import DisplayPost from './DisplayPost';
import { useLocation } from 'react-router-dom';
import CreatePost from './CreatePost';
import Navbar from './Navbar';
import PostHeading from './PostHeading';

const Home = () => {
  const location = useLocation();
  const [addItems, setItems] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [jwtToken, setJwtToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [authorId, setAuthorId] = useState(null);
  const [reload, setReload] = useState(false);

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
    
  }, [reload]);

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

  const handlePostCreated = () => {
    setReload(prev => !prev);
  };

  return (
    <>
      <Navbar username={username} email={email} userId={authorId} />
      
      {jwtToken && refreshToken ? (
        <CreatePost
          onPostCreated={handlePostCreated} 
          jwtToken={jwtToken}
          refreshToken={refreshToken}
          username={username}
          authorId={authorId}
        />
      ) : (
        <p>Loading...</p>
      )}

      <PostHeading />

      <div
        className="writtenNotes"
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent:"center",
          marginBottom: '15px',
        }}
      >
        {addItems.map((curEle, idx) => (
          <DisplayPost
            key={idx} 
            title={curEle.title}
            content={curEle.content}
            images={curEle.images}
            idAuthor={curEle.author_id}
            blog_id={curEle.id}
            likes={curEle.likes}
            jwtToken={jwtToken}
            refreshToken={refreshToken}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
