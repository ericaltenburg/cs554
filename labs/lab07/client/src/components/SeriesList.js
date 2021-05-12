import React, {useEffect} from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import noImage from '../img/download.png';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../actions';
import {Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles} from '@material-ui/core';

import '../App.css';
const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold'
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

const expressAPI = "http://localhost:3000";

const SeriesList = () => {
    let { page } = useParams();
    const classes = useStyles();
    let card = null;
    const regex = /(<([^>]+)>)/gi;
    const dispatch = useDispatch();

    const allSeries = useSelector((state) => state.seriesList);
    let curr_state = allSeries.find((element) => element.pageTerm === `seriesList page number ${page}`);
    let seriesData ='';
    if (curr_state) {
        seriesData = curr_state.seriesData;
    }

    useEffect( () => {
        console.log('series page num was changed');
        async function fetchData() {
            try {
                const {data} = await axios.get(`${expressAPI}/series/page/${page}`);
                if (data.length === 0) {
                    throw "No entries found";
                }
                dispatch(actions.setPage(`seriesList page number ${page}`, data));
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [ page ]);

    const buildCard = (the_series) => {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={the_series.id}>
                <Card className={classes.card} variant="outlined">
                    <CardActionArea>
                        <Link to={`/series/${the_series.id}`}>
                            <CardMedia
                                className={classes.media}
                                component='img'
                                image={the_series.thumbnail.path.includes("image_not_available") ? noImage : the_series.thumbnail.path+'/portrait_incredible.'+the_series.thumbnail.extension}
                                title="Series Image"
                                onError={ e => {
                                    e.target.src=noImage;
                                }}
                            />
                            <CardContent>
                                <Typography className={classes.titleHead} gutterBottom variant='h6' component='h2'>
                                    {the_series.title}
                                </Typography>
                                <Typography variant='body2' color='textSecondary' component='p'>
                                    {the_series.description ? the_series.description.replace(regex, '').substring(0,139).trim()+"..." : "No Description..."}
                                    <span> More Info</span>
                                </Typography>
                            </CardContent>
                        </Link>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    };

    card = seriesData && seriesData.map( (the_series) => {
        return buildCard(the_series);
    });

    if (!curr_state) {
        return(
            <div>
                <h2>404 Error...</h2>
            </div>
        );
    } else {
        if (parseInt(page) !== 0) {
            return (
                <div>
                    <Link className='pageprevnext' to={`/series/page/${parseInt(page)-1}`}>Previous Page</Link> 
                    <Link className='pageprevnext' to={`/series/page/${parseInt(page)+1}`}>Next Page</Link>
                    <br />
                    <br />
                    <br />
                    <br />
                    <Grid container className={classes.grid} spacing={5}>
                        {card}
                    </Grid>
                </div>
            );
        } else {
            return (
                <div>
                    <Link className="pageprevnext" to={`/series/page/${parseInt(page)+1}`}>Next Page</Link>
                    <br />
                    <br />
                    <br />
                    <br />
                    <Grid container className={classes.grid} spacing={5}>
						{card}
					</Grid>
                </div>
            );
        }
    }
};

export default SeriesList;