import { combineReducers } from 'redux';
import characterListReducer from './characterListReducer';
import charactersReducer from './charactersReducer';
import seriesListReducer from './seriesListReducer';
import seriesReducer from './seriesReducer';
import comicListReducer from './comicListReducer';
import comicsReducer from './comicsReducer';

const rootReducer = combineReducers({
    characterList: characterListReducer,
    characters: charactersReducer,
    seriesList: seriesListReducer,
    series: seriesReducer,
    comicList: comicListReducer,
    comics: comicsReducer
});

export default rootReducer;