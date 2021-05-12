import React, {useEffect} from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import noImage from '../img/download.png';
import actions from '../actions';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import '../App.css';

const useStyles = makeStyles({
	card: {
		maxWidth: 550,
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

const Character = () => {
    let { id } = useParams();
    const classes = useStyles();
    const regex = /(<([^>]+)>)/gi;
    let comics_inject = <dd key="no_comics"><br />N/A</dd>;
    let series_inject = <dd key="no_series"><br />N/A</dd>;
    const dispatch = useDispatch();
    const wholeCharacter = useSelector((state) => state.characters);
    let curr_character = wholeCharacter.find((element) => element.pageTerm === `characters id ${id}`);
    let characterData = '';
    if (curr_character) {
        characterData = curr_character.characterData;
    }

    useEffect( () => {
        console.log("character was selected");
        async function fetchData() {
            try {
                const {data} = await axios.get(`${expressAPI}/characters/${id}`);
                if (data.length === 0) {
                    throw "no entry found";
                }
                dispatch(actions.setPage(`characters id ${id}`, data));
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [id]);

    if (characterData && characterData.comics && characterData.comics.available >=1) {
        comics_inject = 
            <span>
                <br />
                {characterData.comics.items.slice(0,20).map((comic) => {
                    let num = comic.resourceURI.match(/\d+$/)[0];

                    if (characterData.comics.items.length > 1)
                        return <dd key={comic.resourceURI}><Link to={`/comics/${num}`}>{comic.name}</Link><br /></dd>
                    return <dd key={comic.resourceURI}><Link to={`/comics/${num}`}>{comic.name}</Link></dd>
                })}
            </span>
    }

    if (characterData && characterData.series && characterData.series.available >=1) {
        series_inject = 
            <span>
                <br />
                {characterData.series.items.slice(0,20).map((the_series) => {
                    let num = the_series.resourceURI.match(/\d+$/)[0];

                    if (characterData.series.items.length > 1)
                        return <dd key={the_series.resourceURI}><Link to={`/series/${num}`}>{the_series.name}</Link><br /></dd>
                    return <dd key={the_series.resourceURI}><Link to={`/series/${num}`}>{the_series.name}</Link></dd>
                })}
            </span>
    }

    if (!curr_character) {
        return (
            <div>
                <h2>404 Error...</h2>
            </div>
        );
    } else {
        return (
            <Card className={classes.card} variant='outlined'>
                <CardHeader className={classes.titleHead} title={characterData.name} />
                <CardMedia
                    className={classes.media}
                    component='img'
                    image={characterData.thumbnail.path.includes("image_not_available") ? noImage : characterData.thumbnail.path+'/portrait_incredible.'+characterData.thumbnail.extension}
                    onError={ e => {
                        e.target.src=noImage;
                    }}
                    title='character image'
                />

                <CardContent>
                    <Typography variant='body2' color='textSecondary' component='span'>
                        <dl>
                            <p>
                                <dt className="title">Description:</dt>
                                {!characterData.description ? <dd>N/A</dd> : <dd>{characterData.description.replace(regex,'')}</dd>}
                            </p>

                            <p>
                                <dt className="title">Comics Featured:</dt>
                                { comics_inject }
                            </p>

                            <p>
                                <dt className="title">Series Featured:</dt>
                                { series_inject }
                            </p>

                            <p>
                                <dt className="title">Events Featured:</dt>
                                {
                                    characterData && characterData.events && characterData.events.available >= 1 ? (
                                        <span>
                                            <br />
                                            {characterData.events.items.slice(0,20).map((the_event) => {
                                                if (characterData.events.items.length > 1)
                                                    return <dd key={the_event.resourceURI}>{the_event.name}<br /></dd>;
                                                return <dd key={the_event.resourceURI}>{the_event.name}</dd>;
                                            })}
                                        </span>
                                    ) : (
                                        <dd key="no_events"><br />N/A</dd>
                                    )
                                }
                            </p>

                            <p>
                                <dt className="title">Stories Featured:</dt>
                                {
                                    characterData && characterData.stories && characterData.stories.available >= 1 ? (
                                        <span>
                                            <br />
                                            {characterData.stories.items.slice(0,20).map((story) => {
                                                if (characterData.stories.items.length > 1)
                                                    return <dd key={story.resourceURI}>{story.name}<br /></dd>;
                                                return <dd key={story.resourceURI}>{story.name}</dd>;
                                            })}
                                        </span>
                                    ) : (
                                        <dd key="no_stories"><br />N/A</dd>
                                    )
                                }
                            </p>
                        </dl>
                        <Link to={`/characters/page/0`}>Back to all characters...</Link>
                    </Typography>
                </CardContent>
            </Card>
        );
    }
};


export default Character;