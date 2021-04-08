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

const Comic = () => {
    let { id } = useParams();
    const [ comicData, setComicData ] = useState(undefined);
    const [ loading, setLoading ] = useState(true);
    const [ badLoad, setBadLoad ] = useState(false);
    const classes = useStyles();
    const regex = /(<([^>]+)>)/gi;
    let characters_inject = <dd key="no_characters"><br />N/A</dd>;

    useEffect( () => {
        console.log("comic was selected");
        async function fetchData () {
            try {
                setLoading(true);

                const publickey = '427973cb31fe34eeffacd502334f8894';
                const privatekey = '2cc1e97508d63501b4c99ebce874c1f6366b2f23';
                const ts = new Date().getTime();
                const stringToHash = ts + privatekey + publickey;
                const hash = md5(stringToHash);
                const baseURL = `https://gateway.marvel.com:443/v1/public/comics/${id}`;
                const URL = baseURL + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

                const { data } = await axios.get(URL);
                if (data.data.count === 0) throw new Error(`No comic associated with that ID was found.`);
                setComicData(data.data.results[0]);
                setLoading(false);
                setBadLoad(false);
            } catch (e) {
                setBadLoad(true);
                console.log(e);
            }
        }
        fetchData();
    }, [ id ]);

    if (comicData && comicData.characters.available >=1) {
        characters_inject = 
            <span>
                <br />
                {comicData.characters.items.map((character) => {
                    let num = character.resourceURI.match(/\d+$/)[0];
                    
                    if (comicData.characters.items.length > 1)
                        return <dd key={character.name}><Link to={`/characters/${num}`}>{character.name}</Link><br /></dd>
                    return <dd key={character.name}><Link to={`/characters/${num}`}>{character.name}</Link></dd>
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
                <CardHeader className={classes.titleHead} title={comicData.title} />
                <CardMedia 
                    className={classes.media}
                    component='img'
                    image={comicData.thumbnail.path.includes('image_not_available') ? noImage : comicData.thumbnail.path+'/portrait_incredible.'+comicData.thumbnail.extension}
                    onError={ e => {
                        e.target.src=noImage;
                    }}
                    title='comic image'
                />
                <CardContent>
                    <Typography variant='body2' color='textSecondary' component='span'>
                        <dl>
                            <p>
                                <dt className="title">Description:</dt>
                                {!comicData.description ? <dd>N/A</dd> : <dd>{comicData.description.replace(regex,'')}</dd>}
                            </p>

                            <p>
                                <dt className='title'>Page Count:</dt>
                                {!comicData.pageCount && comicData.pageCount !== 0 ? <dd>N/A</dd> : <dd>{comicData.pageCount}</dd>}
                            </p>

                            <p>
                                <dt className="title">Creators:</dt>
                                {
                                    comicData && comicData.creators.available >= 1 ? (
                                        <span>
                                            <br />
                                            {comicData.creators.items.map((creator) => {
                                                if (comicData.creators.items.length > 1)
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
                        </dl>
                        <Link to={`/comics/page/0`}>Back to all comics...</Link>
                    </Typography>
                </CardContent>
            </Card>
        );
    }
};

export default Comic;