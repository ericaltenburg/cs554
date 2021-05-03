import { useState, useEffect } from 'react';
import queries from '../queries';
import { useMutation } from '@apollo/client';
import '../App.css';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import Box from '@material-ui/core/Box'

const AddToBin = (props) => {
    const [ imagePost, setImagePost ] = useState(props.image);
    const [ updateImage ] = useMutation(queries.UPDATE_IMAGE);

    useEffect( () => {
        setImagePost(props.image);
    }, [props.image]);

    const handleUnbin = () => {
        const updateImageVar = {
            id: imagePost.id,
            url: imagePost.url,
            posterName: imagePost.posterName,
            description: imagePost.description,
            userPosted: imagePost.userPosted,
            binned: false
        };

        setImagePost(updateImageVar);
        updateImage({
            variables: updateImageVar
        });
    };

    const handleBin = () => {
        const updateImageVar = {
            id: imagePost.id,
            url: imagePost.url,
            posterName: imagePost.posterName,
            description: imagePost.description,
            userPosted: imagePost.userPosted,
            binned: true
        };

        setImagePost(updateImageVar);
        updateImage({
            variables: updateImageVar
        });
    };

    if (imagePost.binned) { // Currently binned, we want to unbin it
        return (
            <Box p={2}>
                <Button 
                    onClick={() => { handleUnbin(); }}
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    disabled={props.deleted}
                >
                    Remove from bin
                </Button>
            </Box>
        )
    } else { // Currently not binned, we want to bin it
        return (
            <Box p={2}>
                <Button 
                    onClick={() => { handleBin(); }}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={props.deleted}
                >
                    Add to bin
                </Button>
            </Box>
        )
    }
}

export default AddToBin;