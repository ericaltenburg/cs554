import React, {useState, useEffect} from 'react';
import axios from 'axios';
import md5 from 'blueimp-md5';
import { Link, useParams } from 'react-router-dom';
import noImage from '../img/download.png';
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

const publickey = '427973cb31fe34eeffacd502334f8894';
const privatekey = '2cc1e97508d63501b4c99ebce874c1f6366b2f23';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseURL = 'https://gateway.marvel.com:443/v1/public/characters';
const URL = baseURL + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

const CharacterList = () => {
    let { page } = useParams();
    const classes = useStyles();
    const [ loading, setLoading ] = useState(true);
    const [ characterData, setCharacterData ] = useState(undefined);
    const [ badLoad, setBadLoad ] = useState(false);
    let card = null;
    const regex = /(<([^>]+)>)/gi;

    useEffect( () => {
        console.log('character page num was changed');
        async function fetchData () {
            try {
                setLoading(true);
                const { data } = await axios.get(`${URL}&offset=${parseInt(page)*20}`);
                if (data.data.count===0) throw new Error(`No more entries found.`);
                console.log(data)
                setCharacterData(data.data.results);
                setBadLoad(false);
                setLoading(false);
            } catch (e) {
                setBadLoad(true);
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
                                <Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
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

    if (badLoad) {
        return(
            <div>
                <h2>404 Error...</h2>
            </div>
        );
    } else if (loading) {
        return (
            <div>
                <h2>Loading...</h2>
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
                    <Grid container className={classes.grid} spacing={5}>
						{card}
					</Grid>
                </div>
            );
        }
    }
};

export default CharacterList;