import Vue from 'vue';
import Router from 'vue-router';
import CharacterList from './components/CharacterList.vue';
import Character from './components/Character.vue';
import SeriesList from './components/SeriesList.vue';
import Series from './components/Series.vue';
import ComicsList from './components/ComicsList.vue';
import Comics from './components/Comics.vue';
import Home from './components/Home.vue';

Vue.use(Router);

export default new Router ({
    routes: [
        {
            path: "/characters/page/:page",
            name: "characterList",
            component: CharacterList
        },
        {
            path: "/characters/:id",
            name: "character",
            component: Character
        },
        {
            path: "/series/page/:page",
            name: "seriesList",
            component: SeriesList
        },
        {
            path: "/series/:id",
            name: "series",
            component: Series
        },
        {
            path: "/comics/page/:page",
            name: "comicsList",
            component: ComicsList
        },
        {
            path: "/comics/:id",
            name: "comics",
            component: Comics
        },
        {
            path: "/",
            name: "home",
            component: Home
        },
    ],
    mode: 'history'
})