import { useState } from 'react';
import queries from '../queries';
import { useMutation } from '@apollo/client';
import '../App.css';
import { Button } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { withRouter } from 'react-router';

const NewPost = (props) => {
    const [ uploadImage ] = useMutation(queries.UPLOAD_IMAGE);
    const [ url, setURL ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ posterName, setPosterName ] = useState('');

    const handleURL = (event) => {
        setURL(event.target.value);
    };

    const handleDescription = (event) => {
        setDescription(event.target.value);
    };

    const handlePosterName = (event) => {
        setPosterName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const newImage = {
            url: url,
            description: description,
            posterName: posterName
        };

        uploadImage({
            variables: newImage
        });

        setURL('');
        setDescription('');
        setPosterName('');
        props.history.push('/my-posts');
    };


    return (
        <div>
            <form 
                className="form"
                onSubmit={handleSubmit}
            >
                <div>
                    <label>
                        URL:
                        <br />
                        <input 
                            type="text"
                            onChange={handleURL}
                            value={url}
                            required
                            autoFocus={true} />
                    </label>
                </div>
                <br />
                <div>
                    <label>
                        Description:
                        <br />
                        <textarea 
                            type="text"
                            onChange={handleDescription}
                            value={description} /> 
                    </label>
                </div>
                <br />
                <div>
                    <label>
                        Name:
                        <br />
                        <input  
                            type="text"
                            onChange={handlePosterName}
                            value={posterName} />
                    </label>
                </div>

                <br />
                <br />
                <Button variant="contained" type="submit" startIcon={<CloudUploadIcon />}>Submit</Button>
            </form>
        </div>
    );
}

export default withRouter(NewPost);