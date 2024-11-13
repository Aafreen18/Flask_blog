import React, { useState } from 'react';


const CreatePost = (props) => {
  const { passPosts, jwtToken } = props;
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState({
    title: '',
    content: '',
    author: ''
  });

  
  console.log("JWT Token:", jwtToken);
  console.log("JWT Token:", passPosts);



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

  const addEvent = async () => {
    console.log("blog posted");
    try {
      const response = await fetch('https://flask-blog-boic.onrender.com/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${jwtToken}`
        },
        body: JSON.stringify(posts), // Send the form data as JSON
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Post created successfully:', data);

        props.passPosts(posts);
        
        // Reset form after successful post
        setPosts({
          title: '',
          content: '',
          author: ''
        });
      } else {
        console.error('Failed to create post:', data);
      }
    } catch (error) {
      console.error('Error occurred while creating post:', error);
    }
  };

  const backToNormal = () => {
    setShow(false);
  };

  return (
    <>
      <div className='container'>
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
            ></input>
          </div>
        )}
      </div>
    </>
  );
};

export default CreatePost;
