import React, { useState, useEffect } from 'react';
import {Card, CardHeader, CardMedia, Grid, makeStyles} from '@material-ui/core';
import queries from '../queries';
import { useQuery } from '@apollo/client';
import '../App.css'
import AddToBin from './AddToBin';
import {
    BrowserRouter as Router,
    Route,
    Link
} from "react-router-dom";
import NewPost from './NewPost';

const useStyles = makeStyles({
	card: {
		maxWidth: '50%',
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid black',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});

const MyFeed = () => {
    const classes = useStyles();
    const [ imageData, setImageData ] = useState([]);
    const { loading, error, data } = useQuery(queries.GET_ALL_USER_IMAGES, {
        fetchPolicy: 'no-cache'
    });
    let card = null;

    useEffect(() => {
        if (data) {
            const combinedImages = [...imageData,...data.userPostedImages];
            setImageData(combinedImages);
        }
    }, [data]);

    const buildCard = (image) => {
        return (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={image.id}>
                <Card className={classes.card} variant="outlined">
                    <CardHeader 
                        title={image.description}
                        subheader={`By: ${image.posterName}`}
                    />
                    <CardMedia
                        className={classes.media}
                        component='img'
                        image={image.url}
                        title="Bintrest Image"
                    />
                    <AddToBin image={image} />
                </Card>
            </Grid>
        );
    };

    card = imageData && imageData.map((image) => {
        return buildCard(image);
    });

    if (!imageData.length) {
        return (
            <div>
                <h2>Nothing to see here...</h2>
            </div>
        );
    }

    if (loading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (error) {
        console.log(error);
        return (
            <div>
                <h2>Error...</h2>
            </div>
        );
    }

    return (
        <div>
            <Link className="showlink" to="/new-post">New Post</Link>
            <br />
            <br />
            <Grid container className={classes.grid} spacing={5}>
                {card}
            </Grid>

            <Router>
                <Route path="/new-post">
                    <NewPost />
                </Route>
            </Router>
        </div>
    );
}

export default MyFeed;