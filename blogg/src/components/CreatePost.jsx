import React, { useState } from 'react';

const CreatePost = (props) => {
  const { jwtToken, refreshToken, username, authorId, onPostCreated} = props;
  const [show, setShow] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [posts, setPosts] = useState({
    title: '',
    content: '',
    author_id: authorId,
    images: []
  });

  const refreshAccessToken = async () => {
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
    const files = Array.from(e.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]); 
  };

  const addEvent = async () => {
    try {
        const formData = new FormData();
        formData.append('title', posts.title);
        formData.append('content', posts.content);
        formData.append('author_id', posts.author_id);

        for (let i = 0; i < selectedImages.length; i++) {
          formData.append('images', selectedImages[i]); 
        }
        
        let currentToken = jwtToken;
        const response = await fetch('https://sdcblogproject.onrender.com/api/blogs/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
          },
          body: formData
        });

        if (response.status === 401) {
            const newToken = await refreshAccessToken();
            if (newToken) {
              const retryResponse = await fetch('https://sdcblogproject.onrender.com/api/blogs/', {
                  method: 'POST',
                  headers: {
                  'Authorization': `Bearer ${newToken}`
                },
                body: formData
              });

              const data = await retryResponse.json();
              if (retryResponse.ok) {
                setPosts({
                  title: '',
                  content: '',
                  author_id: authorId,
                  images: []
                });
                setSelectedImages([]);
                setShow(false);

                if (onPostCreated) {
                  onPostCreated();
                }
              } else {
                console.error('Failed to create post:', data);
              }
            } else {
              console.error('Authentication completely failed');
            }
        } else {
          const data = await response.json();
          if (response.ok) {
            setPosts({
                title: '',
                content: '',
                author_id: authorId,
                images: []
            });
            setSelectedImages([]);
            setShow(false);

            if (onPostCreated) {
              onPostCreated();
            }
          } else {
            console.error('Failed to create post:', data);
          }
        }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const backToNormal = () => {
    setShow(false);
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

  return (
    <>
      {show && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              backToNormal();
            }
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              width: '80%',
              maxWidth: '500px',
              maxHeight: '80%',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='d-flex flex-column'>
              <div className="d-flex align-items-center">
                <div 
                  className="Me justify-content-center " 
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    backgroundColor: 'rgb(243, 158, 67)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 'bold', 
                    fontSize: '20px', 
                    color: 'black',
                    alignSelf: 'center',
                    marginBottom: '10px'
                  }}
                >
                  {username && username[0].toUpperCase()}
                </div>
                <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>{username}</h4>
              </div>

              <input
                type='text'
                name='title'
                value={posts.title}
                placeholder='Title'
                onChange={handlePostInputChange}
                style={{ 
                  width: '100%', 
                  marginBottom: '10px', 
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px'
                }}
              />

              <textarea
                name='content'
                value={posts.content}
                placeholder='Write a post...'
                onChange={handlePostInputChange}
                style={{ 
                  width: '100%', 
                  marginBottom: '10px', 
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  minHeight: '100px'
                }}
              />

              <div className="d-flex align-items-center mb-3">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <label 
                  htmlFor="imageUpload" 
                  className="btn me-2 butt"
                  style={{
                    cursor: 'pointer',
                    border: '1px solid rgb(243, 158, 67)',
                    color: 'white',
                    backgroundColor:'rgb(243, 158, 67)'
                  }}
                >
                  Upload Images
                </label>
                {selectedImages.length > 0 && (
                  <span className="text-muted">
                    {selectedImages.length} image(s) selected
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={backToNormal}
                  className='butt'
                  style={{
                    marginRight: '10px',
                    backgroundColor: 'white',
                    color: 'rgb(243, 158, 67)',
                    border: '1px solid rgb(243, 158, 67)',
                    borderRadius: '5px',
                    padding: '5px 10px'
                  }}
                >
                  Cancel
                </button>
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
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='container'>
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
              color: 'black' 
            }}
          >
            {username && username[0].toUpperCase()}
          </div>
          <h4>{username}</h4>
        </div>
        
        <div className='write'>
          <input
            className='text-black-50'
            placeholder='Write a post...'
            onClick={inputEvent}
            style={{width:"100%", marginLeft:"0"}}
          />
        </div>
      </div>
    </>
  );
};

export default CreatePost;
