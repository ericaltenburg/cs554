import React, { useEffect } from 'react';
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

const CharacterList = () => {
    let { page } = useParams();
    const classes = useStyles();
    let card = null;
    const regex = /(<([^>]+)>)/gi;
    const dispatch = useDispatch();

    const allCharacters = useSelector((state) => state.characterList);
    let curr_state = allCharacters.find((element) => element.pageTerm === `characterList page number ${page}`);
    let characterData = "";
    if (curr_state) {
        characterData = curr_state.characterData;
    }


    useEffect( () => {
        console.log('character page num was changed');
        async function fetchData () {
            try {
                const {data} = await axios.get(`${expressAPI}/characters/page/${page}`);
                if (data.length === 0) {
                    throw "No entries found";
                }
                dispatch(actions.setPage(`characterList page number ${page}`, data));
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [page]);

    const buildCard = (character) => {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={character.id}>
                <Card className={classes.card} variant="outlined">
                    <CardActionArea>
                        <Link to={`/characters/${character.id}`}>
                            <CardMedia
                                className={classes.media}
                                component='img'
                                image={character.thumbnail.path.includes("image_not_available") ? noImage : character.thumbnail.path+'/portrait_incredible.'+character.thumbnail.extension}
                                title="Character Image"
                                onError={ e => {
                                    e.target.src=noImage;
                                }}
                            />
                            <CardContent>
                                <Typography className={classes.titleHead} gutterBottom variant='h6' component='h2'>
                                    {character.name}
                                </Typography>
                                <Typography variant='body2' color='textSecondary' component='p'>
                                    {character.description ? character.description.replace(regex, '').substring(0,139).trim()+"..." : "No Description..."}
                                    <span> More Info</span>
                                </Typography>
                            </CardContent>
                        </Link>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    };


    card = characterData && characterData.map( (character) => {
        return buildCard(character);
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
                    <Link className='pageprevnext' to={`/characters/page/${parseInt(page)-1}`}>Previous Page</Link> 
                    <Link className='pageprevnext' to={`/characters/page/${parseInt(page)+1}`}>Next Page</Link>
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
                    <Link className="pageprevnext" to={`/characters/page/${parseInt(page)+1}`}>Next Page</Link>
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

export default CharacterList;