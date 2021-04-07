import React, {useState, useEffect} from 'react';
import md5 from 'blueimp-md5';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import noImage from '../img/download.png';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader } from '@material-ui/core';

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

const Character = () => {
    let { id } = useParams();
    const [ characterData, setCharacterData ] = useState(undefined);
    const [ loading, setLoading ] = useState(true);
    const [ badLoad, setBadLoad ] = useState(false);
    const classes = useStyles();
    const regex = /(<([^>]+)>)/gi;
    let comics_inject = <dd key="no_comics"><br />N/A</dd>;

    useEffect( () => {
        console.log("character was selected");
        async function fetchData() {
            try {
                setLoading(true);

                const publickey = '427973cb31fe34eeffacd502334f8894';
                const privatekey = '2cc1e97508d63501b4c99ebce874c1f6366b2f23';
                const ts = new Date().getTime();
                const stringToHash = ts + privatekey + publickey;
                const hash = md5(stringToHash);
                const baseURL = `https://gateway.marvel.com:443/v1/public/characters/${id}`;
                const URL = baseURL + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

                const { data } = await axios.get(URL);
                if (data.data.count===0) throw new Error(`No character associated with that ID was found.`);
                console.log(data);
                setCharacterData(data.data.results[0]);
                setLoading(false);
                setBadLoad(false);
            } catch (e) {
                setBadLoad(true);
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
                        return <dd key={comic.name}><Link to={`/comics/${num}`}>{comic.name}</Link><br /></dd>
                    return <dd key={comic.name}><Link to={`/comics/${num}`}>{comic.name}</Link></dd>
                })}
            </span>
    }

    if (badLoad) {
        return (
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
                                <dt className="title">Comics:</dt>
                                { comics_inject }
                            </p>

                            <p>
                                <dt className="title">Events:</dt>
                                {
                                    characterData && characterData.events && characterData.events.available >= 1 ? (
                                        <span>
                                            <br />
                                            {characterData.events.items.slice(0,20).map((the_event) => {
                                                if (characterData.events.items.length > 1)
                                                    return <dd key={the_event.name}>{the_event.name}<br /></dd>;
                                                return <dd key={the_event.name}>{the_event.name}</dd>;
                                            })}
                                        </span>
                                    ) : (
                                        <dd key="no_events"><br />N/A</dd>
                                    )
                                }
                            </p>

                            <p>
                                <dt className="title">Series:</dt>
                                {
                                    characterData && characterData.series && characterData.series.available >=1 ? (
                                        <span>
                                            <br />
                                            {characterData.series.items.slice(0,20).map((the_series) => {
                                                if (characterData.series.items.length > 1)
                                                    return <dd key={the_series.name}>{the_series.name}<br /></dd>;
                                                return <dd key={the_series.name}>{the_series.name}</dd>;
                                            })}
                                        </span>
                                    ) : (
                                        <dd key="no_series"><br />N/A</dd>
                                    )
                                }
                            </p>

                            <p>
                                <dt className="title">Stories:</dt>
                                {
                                    characterData && characterData.stories && characterData.stories.available >= 1 ? (
                                        <span>
                                            <br />
                                            {characterData.stories.items.slice(0,20).map((story) => {
                                                if (characterData.stories.items.length > 1)
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
                        <Link to={`/characters/page/0`}>Back to all characters...</Link>
                    </Typography>
                </CardContent>
            </Card>
        );
    }
};



export default Character;