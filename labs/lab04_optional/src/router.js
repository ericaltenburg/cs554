import Vue from 'vue';
import Router from 'vue-router';
import CharacterList from './components/CharacterList.vue';
import Character from './components/Character.vue';
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
            path: "/",
            name: "home",
            component: Home
        },
    ],
    mode: 'history'
})