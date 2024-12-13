import React from 'react';

const DisplayPost = (props) => {
  const { title, content, images, id, username } = props;
  const getValidImageUrl = (imageUrl) => {
    return imageUrl.slice(13)
    
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
      {/* Header with Username */}
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
          {username && username[0].toUpperCase()}
        </div>
        <h4 style={{ margin: 0, fontSize: '16px',color:"black" }}>{username}</h4>

       
      </div>

      {/* Image Section */}
       {images && images.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}>
          {images.map((image, index) => {
            const validUrl = `${getValidImageUrl(image["image"])}`;
            console.log(validUrl);

            return (
              <img
                key={index}
                src={validUrl}
                alt={`Post ${index + 1}`}
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
                onError={(e) => { e.target.src = '/path/to/placeholder-image.jpg'; }}
              />
            );
          })}
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
    </div>
  );
};

export default DisplayPost;