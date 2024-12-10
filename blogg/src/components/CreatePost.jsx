import React, { useState } from 'react';


const CreatePost = (props) => {
  const { passPosts, jwtToken, refreshToken, username } = props;
  const [show, setShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [posts, setPosts] = useState({
    title: '',
    content: '',
    author: '',
    image: null
  });

  
  console.log("JWT Token:", jwtToken);
  console.log("JWT Token:", passPosts);

  const refreshAccessToken = async () => {
    try {
        console.log("Attempting to refresh token with:", refreshToken);
        
        const response = await fetch(`https://sdcblogproject.onrender.com/refresh_token/${refreshToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                refresh: refreshToken 
            })
        });

        console.log("Refresh response status:", response.status);

        // Check if the response is OK
        if (response.ok) {
            const data = await response.json();
            console.log("Refresh token response:", data);
            
            // Update access token in localStorage and state
            localStorage.setItem('access', data.access);
            return data.access;
        } else {
            // Try to get error details
            const errorText = await response.text();
            console.error('Refresh token error response:', errorText);

            // Handle refresh token failure 
            console.error('Failed to refresh token. Status:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Comprehensive Token Refresh Error:', error);
        return null;
    }
};


  
  const inputEvent = (event) => {
    const { name, value } = event.target;

    setShow(true);
    setPosts((preVal) => {
      return {
        ...preVal,
        [name]: value
      };
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setPosts(prevPosts => ({
          ...prevPosts,
          image: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };


  const addEvent = async () => {
    try {
        let currentToken = jwtToken;

        const response = await fetch('https://sdcblogproject.onrender.com/api/blogs/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify(posts),
        });

        console.log('Initial post response status:', response.status);

        // If unauthorized, try to refresh the token
        if (response.status === 401) {
            console.log('Token unauthorized, attempting refresh');
            const newToken = await refreshAccessToken();
            
            if (newToken) {
                console.log('Got new token, retrying post');
                const retryResponse = await fetch('https://sdcblogproject.onrender.com/api/blogs/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newToken}`
                    },
                    body: JSON.stringify(posts),
                });

                console.log('Retry post response status:', retryResponse.status);

                const data = await retryResponse.json();
                if (retryResponse.ok) {
                    console.log('Post created successfully:', data);
                    props.passPosts(posts);
                    setPosts({
                        title: '',
                        content: '',
                        author: ''
                    });
                } else {
                    console.error('Failed to create post:', data);
                }
            } else {
                // Refresh token failed, redirect to login or show error
                console.error('Authentication completely failed');
                // Optionally: redirect to login page
                // window.location.href = '/login';
            }
        } else {
            const data = await response.json();
            if (response.ok) {
                console.log('Post created successfully:', data);
                props.passPosts(posts);
                setPosts({
                    title: '',
                    content: '',
                    author: ''
                });
            } else {
                console.error('Failed to create post:', data);
            }
        }
    } catch (error) {
        console.error('Comprehensive error occurred while creating post:', error);
    }
  };

  const backToNormal = () => {
    setShow(false);
  };

  return (
    <>
      <div className='container ' style={{backgroundColor:""}}>
        <div className='d-flex flex-column me-3'>
        <div 
            className="Me justify-content-center " 
            style={{ 
                width: '50px', 
                height: '50px', 
                backgroundColor: 'white', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 'bold', 
                fontSize: '20px', 
                color: 'black' ,
                
            }}
            >
            {username && username[0].toUpperCase()}
        </div>
          <h4>{username}</h4>
        </div>
        
        {show ? (
          <div className='d-flex flex-column writeDiv' onDoubleClick={backToNormal}>
            <h3>
              <input
                type='text'
                name='title'
                value={posts.title}
                placeholder='Title'
                onChange={inputEvent}
                style={{ width: '100%' }}
              ></input>
            </h3>
            <input
              type='number'
              name='author'
              value={posts.author}
              placeholder='Author ID'
              onChange={inputEvent}
              className='mb-2'
            ></input>
            <input
              type='text'
              name='content'
              value={posts.content}
              placeholder='Write a post...'
              onChange={inputEvent}
            ></input>

<div className="d-flex align-items-center mb-2">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <label 
              htmlFor="imageUpload" 
              className="btn btn-outline-secondary me-2"
              style={{
                cursor: 'pointer',
                border: '1px solid rgb(243, 158, 67)',
                color: 'rgb(243, 158, 67)'
              }}
            >
              Upload Image
            </label>
            {selectedImage && (
              <span className="text-muted">
                {posts.image ? posts.image.name : 'Image selected'}
              </span>
            )}
          </div>

            <button
              onClick={addEvent}
              className='addBtn'
              style={{
                marginTop: '15%',
                marginLeft: '85%',
                backgroundColor: 'white',
                border: '1px solid rgb(243, 158, 67)',
                color: 'rgb(243, 158, 67)',
                borderRadius: '50%',
                padding:"5px"
              }}
            >
              Post
            </button>
          </div>
        ) : (
          <div className='write'>
            <input
              className='text-black-50'
              placeholder='Write a post...'
              onClick={inputEvent}
              style={{width:"100%",marginLeft:"0"}}
            ></input>
          </div>
        )}
      </div>
    </>
  );
};

export default CreatePost;
