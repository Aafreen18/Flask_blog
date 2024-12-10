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
                <h3 style={{color:"rgb(243, 158, 67)", fontWeight:"bolder"}}>{props.title}</h3>
                <p>{props.content}</p>
                <div style={{ display: 'flex', justifyContent: "space-around", alignItems:"center", padding: '15px' }}>
                    <button 
                        onClick={deleteNote}
                        className="deleteBtn"
                        style={{
                        backgroundColor:'white',
                        fontWeight:"400",
                        border:'1px solid rgb(243, 158, 67)',
                        color:'rgb(243, 158, 67)',
                        borderRadius: '50%',
                        padding:'5px',
                        marginLeft:"5px"
                        }} > 
                        Update 
                    </button>

                    <button 
                        onClick={deleteNote}
                        className="deleteBtn"
                        style={{
                        backgroundColor:'white',
                        fontWeight:"400",
                        border:'1px solid rgb(243, 158, 67)',
                        color:'rgb(243, 158, 67)',
                        borderRadius: '50%',
                        padding:'5px'
                        }} > 
                        Delete 
                    </button>
                </div>
            </div>
            
        </>
    );
}

export default DisplayPost;