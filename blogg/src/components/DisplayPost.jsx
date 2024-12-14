import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';

const DisplayPost = (props) => {
  const { title, content, images, idAuthor, blog_id, likes, jwtToken, refreshToken} = props;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [like, setlike] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);

  const getValidImageUrl = (imageUrl) => {
    return imageUrl.slice(13); 
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  console.log(blog_id);

  const handleImageDoubleClick = () => {
    navigate(`/post/${blog_id}`, { state: { blog_id } });
  };

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

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`https://sdcblogproject.onrender.com/api/blogs/${blog_id}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
          blog: blog_id,
          comment_text: comment,
          author_id: idAuthor
        })
      });

      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          const retryResponse = await fetch(`https://sdcblogproject.onrender.com/api/blogs/${blog_id}/comments/`, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
          blog: blog_id,
          comment_text: comment,
          author_id: idAuthor
        })})
        
        const newRetryComment = await retryResponse.json();
        setComments([...comments, newRetryComment]);
        setComment(''); 
        console.log("added");

      }else{
      if (response.ok) {
        const newComment = await response.json();
        setComments([...comments, newComment]);
        setComment(''); 
        console.log("added");
      } else {
        console.error('Failed to add comment');
      }}

    } }catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`https://sdcblogproject.onrender.com/api/blogs/${blog_id}/like/`, {
        method: hasLiked ? '' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blog: blog_id,
          author_id: idAuthor
        })
      });

      if (response.ok) {
        const likeData = await response.json();
        setlike(likeData.total_like);
        setHasLiked(!hasLiked);
        console.log("added");
      } else {
        console.error('Failed to add like');
      }
    } catch (error) {
      console.error('Error adding like:', error);
    }
  };

  return (
    <div 
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        width: '320px',
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
          {idAuthor.charAt(0).toUpperCase()}
        </div>
        <h4 style={{ fontSize: '16px', color: "black", whiteSpace: "normal", wordBreak: "break-word" }}>{idAuthor}</h4>
      </div>

      {/* Content Section */}
      <div style={{ 
        padding: '15px', 
        borderTop: images ? '1px solid #f0f0f0' : 'none'
        }}>
        <h3 style={{ 
          marginTop: 0, 
          marginBottom: '10px', 
          fontSize: '18px', 
          color: '#333' 
        }}>
          {title}
        </h3>
        <p style={{ 
          margin: 0, 
          color: '#666', 
          lineHeight: '1.6' 
        }}>
          {content}
        </p>
      </div>

      {/* Image Section */}
      {images && images.length > 0 ? (
        <div style={{ position: 'relative', padding: '10px' }}>
          <img
            src={`${getValidImageUrl(images[currentImageIndex]["image"])}`}
            alt={`Post ${currentImageIndex + 1}`}
            style={{
              width: '100%',
              height: '250px',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
            onError={(e) => { e.target.src = '/path/to/placeholder-image.jpg'; }}
            onDoubleClick={handleImageDoubleClick}
          />
          {images.length > 1 && (
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
      
      {/* {like and comments section} */}
      <div className="blog-interaction d-flex flex-column m-3">

        <div className="like-section">
          <button 
            onDoubleClick={handleLike} 
            style={{ 
              backgroundColor:'white',
              padding:'2px',
              marginRight:'3px'
            }}
          >
           <i className="fa-solid fa-heart" style={{color: hasLiked ? 'red' : 'orange',}}></i>
          </button>
          <span>{like} Likes</span>
        </div>

        <div className="comment-section mt-3">
          <form onSubmit={handleAddComment} style={{display:'flex'}}>
            <input 
              type="text"
              value={comment}
              style={{width:'100%'}}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              required
            />
            <button
                type='submit'
                className='butt'
                style={{
                  backgroundColor: 'white',
                  padding: '5px 10px'
                }}
              >
              Send
            </button>
          </form>
          
          {/* Comments Display */}
          <div className="comments-list">
            <span>{comments.length} Comments</span>
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                {comment.comment_text}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DisplayPost;
