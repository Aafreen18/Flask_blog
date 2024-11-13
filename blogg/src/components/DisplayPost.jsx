import React from "react";
// import Button from '@mui/material/Button';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const DisplayPost = (props) => {
    const deleteNote = ()=> {
        props.deleteItem(props.id);
    }
    console.log("display called")


    return(
        <>
            
            <div className="displayPost">
                <h3>{props.title}</h3>
                <p>{props.content}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                    <button 
                        onClick={deleteNote}
                        className="deleteBtn"
                        style={{
                        backgroundColor:'white',
                        border:'1px solid rgb(243, 158, 67)',
                        color:'rgb(243, 158, 67)',
                        borderRadius: '50%'
                        }} > 
                        delete 
                    </button>
                </div>
            </div>
            
        </>
    );
}

export default DisplayPost;