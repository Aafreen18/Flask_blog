import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const DisplayPost = (props) => {
  const { title, content, images, idAuthor, blog_id} = props;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

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

      {/* {likes and comments section} */}
    </div>
  );
};

export default DisplayPost;
