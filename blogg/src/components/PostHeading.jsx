import React from 'react';

const PostHeading = () => {
  return (
    <div className="heading-wrapper">
      <div className="heading-container">
        <h1 className="Post-heading">
          <span className="main-text">Explore Posts</span>
          <span className="subtitle">Discover the world of stories</span>
        </h1>
      </div>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Roboto:wght@400;500&display=swap');

        .heading-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          padding: 30px 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .heading-container {
          max-width: 800px;
          width: 100%;
          text-align: center;
        }

        .Post-heading {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          animation: fadeIn 1.5s ease-in-out;
        }

        .main-text {
          font-family: 'Poppins', sans-serif;
          font-size: 4rem;
          font-weight: 700;
          background: linear-gradient(45deg, #ff9966, #ff5e62);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-transform: uppercase;
          letter-spacing: 2px;
          position: relative;
          margin-bottom: 15px;
          transition: transform 0.3s ease-in-out;
        }

        .main-text:hover {
          transform: scale(1.1);
          text-shadow: 0px 4px 15px rgba(255, 153, 102, 0.5);
        }

        .main-text::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 4px;
          background: linear-gradient(
            to right, 
            #ff9966, 
            rgba(255, 153, 102, 0.5)
          );
          border-radius: 2px;
          box-shadow: 0 2px 15px rgba(255, 153, 102, 0.5);
        }

        .subtitle {
          font-family: 'Roboto', sans-serif;
          font-size: 1.5rem;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.8);
          letter-spacing: 1.5px;
          opacity: 0.9;
          margin-top: 10px;
          text-transform: capitalize;
        }

        @media (max-width: 768px) {
          .main-text {
            font-size: 2.8rem;
          }

          .subtitle {
            font-size: 1.2rem;
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PostHeading;
