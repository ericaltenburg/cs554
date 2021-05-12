import React from 'react';
import '../App.css';

const Home = () => {
    return(
        <div>
            <p>
                This is a single page application showcasing react components being used to serve information from Marvel Comics such as the characters, comics, and series.
            </p>

            <p className='hometext'>
                This application queries 9 different end-points in the Marvel API:
                <br />
                <br />
                {"/v1/public/characters"}
                <br />
                <br />
                {"/v1/public/characters/&nameStartsWith={SEARCH_TERM}"}
                <br />
                <br />
                {"/v1/public/characters/{characterId}"}
                <br />
                <br />
                {"/v1/public/comics"}
                <br />
                <br />
                {"/v1/public/comics/&titleStartsWith={SEARCH_TERM}"}
                <br />
                <br />
                {"/v1/public/comics/{comicId}"}
                <br />
                <br />
                {"/v1/public/series"}
                <br />
                <br />
                {"/v1/public/series/&titleStartsWith={SEARCH_TERM}"}
                <br />
                <br />
                {"/v1/public/series/{seriesId}"}
                <br />
                <br />
                {"{SEARCH_TERM}"} is what the user types in the search bar, and the various {"{_Id}"}'s are specific Id's for characters, comics, or series.
            </p>
        </div>
    );
};

export default Home;