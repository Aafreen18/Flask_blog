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

  useEffect(() => {
    if (location.state) {
      setUsername(location.state.username || '');
      setEmail(location.state.email || '');
    }

    const accessToken = localStorage.getItem('access');
    const storedRefreshToken = localStorage.getItem("refresh");
    console.log(storedRefreshToken);
    console.log(accessToken);

    if (accessToken) {
      setJwtToken(accessToken);
      localStorage.setItem('access', accessToken);
    }

    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    } else {
      console.warn('No refresh token found');
    }
  }, [location.state]);

  useEffect(() => {
    console.log('JWT Token:', jwtToken);
  }, [jwtToken]); 

  const addPosts = (posts) => {
    setItems((prevVal) => {
      return [...prevVal, { ...posts, key: Date.now() }];
    });
  };

  const deleteNote = (id) => {
    setItems((prevVal) => {
      return prevVal.filter((currData, index) => index !== id);
    });
  };

  return (
    <>
      <Navbar  username = {username} email = {email} />

      {jwtToken && refreshToken ? (
        <CreatePost
          passPosts={addPosts}
          jwtToken={jwtToken}
          refreshToken={refreshToken}
          username = {username}
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
        {addItems.map((curEle, idx) => {
          return (
            <DisplayPost
              key={curEle.key}
              title={curEle.title}
              content={curEle.content}
              deleteItem={deleteNote}
              id={idx}
            />
          );
        })}
      </div>
    </>
  );
};

export default Home;
