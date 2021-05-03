import { useState, useEffect } from 'react';
import queries from '../queries';
import { useMutation } from '@apollo/client';
import '../App.css';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Box from '@material-ui/core/Box';

const DeletePost = ({ image, deleted, setDeleted }) => {
    const [ imagePost, setImagePost ] = useState(image);
    const [ deleteImage ] = useMutation(queries.DELETE_IMAGE);

    useEffect( () => {
        setImagePost(image);
    }, [image]);

    const handleDelete = () => {
        const delImageVar = {
            id: imagePost.id
        };

        deleteImage({
            variables: delImageVar
        });
        setImagePost({
            id: imagePost.id,
            url: imagePost.url,
            posterName: imagePost.posterName,
            description: imagePost.description,
            userPosted: false,
            binned: false
        });
        setDeleted();
    };
    
    if (!deleted) {
        return (
            <Box p={2}>
                <Button 
                    onClick={() => { handleDelete(); }}
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                >
                    Delete post
                </Button>
            </Box>
        )
    } else {
        return (
            <Box p={2}>
                <Button 
                    variant="contained"
                >
                    Post deleted
                </Button>
            </Box>
        )
    }
}

export default DeletePost;