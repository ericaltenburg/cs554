import React, {useEffect} from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import noImage from '../img/download.png';
import actions from '../actions';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader } from '@material-ui/core';
import '../App.css';
import { useDispatch, useSelector } from 'react-redux';
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

const Series = () => {
    let { id } = useParams();
    const classes = useStyles();
    const regex = /(<([^>]+)>)/gi;
    let characters_inject = <dd key="no_characters"><br />N/A</dd>;
    let comics_inject = <dd key="no_comics"><br />N/A</dd>
    const dispatch = useDispatch();
    const wholeSeries = useSelector((state) => state.series);
    let curr_series = wholeSeries.find((element) => element.pageTerm === `series id ${id}`);
    let seriesData = '';
    if (curr_series) {
        seriesData = curr_series.seriesData;
    }

    useEffect( () => {
        console.log("series was selected");
        async function fetchData () {
            try {
                const {data} = await axios.get(`${expressAPI}/series/${id}`);
                if (data.length === 0) {
                    throw "no entry found";
                }
                dispatch(actions.setPage(`series id ${id}`, data));
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [ id ]);

    if (seriesData && seriesData.characters.available >=1) {
        characters_inject = 
            <span>
                <br />
                {seriesData.characters.items.map((character) => {
                    let num = character.resourceURI.match(/\d+$/)[0];
                    
                    if (seriesData.characters.items.length > 1)
                        return <dd key={character.name}><Link to={`/characters/${num}`}>{character.name}</Link><br /></dd>
                    return <dd key={character.name}><Link to={`/characters/${num}`}>{character.name}</Link></dd>
                })}
            </span>
    }

    if (seriesData && seriesData.comics.available >=1) {
        comics_inject = 
            <span>
                <br />
                {seriesData.comics.items.map((comic) => {
                    let num = comic.resourceURI.match(/\d+$/)[0];
                    
                    if (seriesData.comics.items.length > 1)
                        return <dd key={comic.name}><Link to={`/comics/${num}`}>{comic.name}</Link><br /></dd>
                    return <dd key={comic.name}><Link to={`/comics/${num}`}>{comic.name}</Link></dd>
                })}
            </span>
    }

    if (!curr_series) {
        return (
            <div>
                <h2>404 Error...</h2>
            </div>
        );
    } else {
        return (
            <Card className={classes.card} variant='outlined'>
                <CardHeader className={classes.titleHead} title={seriesData.title} />
                <CardMedia 
                    className={classes.media}
                    component='img'
                    image={seriesData.thumbnail.path.includes('image_not_available') ? noImage : seriesData.thumbnail.path+'/portrait_incredible.'+seriesData.thumbnail.extension}
                    onError={ e => {
                        e.target.src=noImage;
                    }}
                    title='series image'
                />
                <CardContent>
                    <Typography variant='body2' color='textSecondary' component='span'>
                        <dl>
                            <p>
                                <dt className="title">Description:</dt>
                                {!seriesData.description ? <dd>N/A</dd> : <dd>{seriesData.description.replace(regex,'')}</dd>}
                            </p>

                            <p>
                                <dt className='title'>Start Year:</dt>
                                {!seriesData.startYear ? <dd>N/A</dd> : <dd>{seriesData.startYear}</dd>}
                            </p>

                            <p>
                                <dt className='title'>End Year:</dt>
                                {!seriesData.endYear ? <dd>N/A</dd> : <dd>{seriesData.endYear}</dd>}
                            </p>

                            <p>
                                <dt className="title">Creators:</dt>
                                {
                                    seriesData && seriesData.creators.available >= 1 ? (
                                        <span>
                                            <br />
                                            {seriesData.creators.items.map((creator) => {
                                                if (seriesData.creators.items.length > 1)
                                                    return <dd key={creator.name}>{`${creator.name} — ${creator.role}`}<br /></dd>
                                                return <dd key={creator.name}>{`${creator.name} — ${creator.role}`}</dd>
                                            })}
                                        </span>
                                    ) : (
                                        <dd key="no_creators"><br />N/A</dd>
                                    )
                                }
                            </p>

                            <p>
                                <dt className='title'>Characters Featured:</dt>
                                { characters_inject }
                            </p>

                            <p>
                                <dt className='title'>Comics Featured:</dt>
                                { comics_inject }
                            </p>

                            <p>
                                <dt className="title">Stories Featured:</dt>
                                {
                                    seriesData && seriesData.stories && seriesData.stories.available >= 1 ? (
                                        <span>
                                            <br />
                                            {seriesData.stories.items.slice(0,20).map((story) => {
                                                if (seriesData.stories.items.length > 1)
                                                    return <dd key={story.name}>{story.name}<br /></dd>;
                                                return <dd key={story.name}>{story.name}</dd>;
                                            })}
                                        </span>
                                    ) : (
                                        <dd key="no_stories"><br />N/A</dd>
                                    )
                                }
                            </p>
                            
                        </dl>
                        <Link to={`/series/page/0`}>Back to all series...</Link>
                    </Typography>
                </CardContent>
            </Card>
        );
    }
};

export default Series;