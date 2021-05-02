import React, { useState, useEffect } from 'react';
import {Card, CardHeader, CardMedia, Grid, makeStyles} from '@material-ui/core';
import queries from '../queries';
import { useQuery } from '@apollo/client';
import '../App.css'
import AddToBin from './AddToBin';

const queryTypes = [queries.GET_ALL_BINNED_IMAGES, queries.GET_ALL_USER_IMAGES];

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

const HomeFeed = () => {
    const classes = useStyles();
    const [ pageNum, setPageNum ] = useState(1);
    const [ imageData, setImageData ] = useState([]);
    const { loading, error, data, refetch } = useQuery(queries.GET_NEW_UNSPLASH_IMAGES, {
        // fetchPolicy: 'no-cache',
        variables: { pageNum }
    });
    let card = null;

    useEffect(() => {
        if (data) {
            const combinedImages = [...imageData,...data.unsplashImages];
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

    const incrementPage = () => {
        setPageNum(pageNum+1);
        refetch();
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
            <Grid container className={classes.grid} spacing={5}>
                {card}
            </Grid>
            <br />
            <br />
            <button onClick={() => {incrementPage();}}>Get More</button>
        </div>
    );
}

export default HomeFeed;