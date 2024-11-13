import React, { useState,useEffect } from 'react';
import DisplayPost from "./DisplayPost";
import CreatePost from './CreatePost';

const Home = () =>{

    const[addItems, setItems] = useState([]);
    const [jwtToken, setJwtToken] = useState(null);

    useEffect(() => {
        // Parse the query parameters from the URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('access'); // Get the "access" parameter
        setJwtToken(token); // Set the token in state or use it as needed

        console.log("JWT Token:", token);
    }, []); // Empty dependency array means this runs only once on load

    const addPosts = (posts) => {
        console.log("added post")
        setItems((preVal) => {
        return [ ...preVal, posts]
        });
    }

    const deleteNote = (id) => {
        setItems((preVal) => {
        return preVal.filter((currData, index)=> {
            return index !== id;
        })
        });
    }

    return(
        <>
            <div className='nav-bar align-content-center'>
                <div className='d-flex justify-content-start align-items-center ms-5'>
                    <h1 className='text-white text-center'>BLOG</h1>
                </div>
            </div>

            <CreatePost passPosts = {addPosts} jwtToken={jwtToken} />
        
        
            <div className="writtenNotes" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap:'10px',marginBottom:'15px' }}>
                
                {
                    addItems.map((curEle,idx) => {
                        return <DisplayPost 
                        title={curEle.title}
                        content={curEle.content} 
                        deleteItem = {deleteNote}
                        id={idx}/>
                    })
                }
            </div>
            
        
        </>

        
    );

    
}

export default Home;
