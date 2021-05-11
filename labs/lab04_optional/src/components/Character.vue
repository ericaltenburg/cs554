<template>
    <div>
        <div v-if="!this.badLoad">
            <h3>{{this.character.name}}</h3>
            <br />
            <img :src="this.character.thumbnail.path+'/portrait_incredible.'+this.character.thumbnail.extension" />
            <br />
            <h4>Description:</h4>
            <p v-if="!this.character.description">N/A</p>
            <span v-else v-html="this.character.description"></span>
            <br />
            <h4>Comics:</h4>
            <ul v-if="!this.noComics">
                <li v-for="comic_book in this.character.comics.items.slice(0,20)" :key="comic_book.resourceURI.match(/\d+$/)[0]">
                    <router-link :to="{path:'/comics/' + (comic_book.resourceURI.match(/\d+$/)[0])}">{{comic_book.name}}</router-link>
                </li>
            </ul>
            <p v-else>N/A</p>
            <h4>Series:</h4>
            <ul v-if="!this.noSeries">
                <li v-for="series_thing in this.character.series.items.slice(0,20)" :key="series_thing.resourceURI.match(/\d+$/)[0]">
                    <router-link :to="{path:'/series/' + (series_thing.resourceURI.match(/\d+$/)[0])}">{{series_thing.name}}</router-link>
                </li>
            </ul>
            <p v-else>N/A</p>
        </div>
        <div v-else>
            <p>404 Error</p>
        </div>
        <br />
        <br />
        <router-link to="/characters/page/0">Back to all characters...</router-link>
    </div>
</template>

<script>
import axios from 'axios';
import md5 from 'blueimp-md5';

const publickey = '427973cb31fe34eeffacd502334f8894';
const privatekey = '2cc1e97508d63501b4c99ebce874c1f6366b2f23';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseURL = `https://gateway.marvel.com:443/v1/public/characters/`;

export default {
    name: "Character",
    data() {
        return {
            id: this.$route.params.id,
            character: {name: null, thumbnail: {}, description: null, comics: { items: [] }, series: { items: []}},
            name: null,
            badLoad: null,
            noComics: null,
            noSeries: null
        };
    },
    methods: {
        getCharacter (id) {
            if (isNaN(parseInt(id)) || parseInt(id) < 0) {
                this.badLoad = true;
            } else {
                const URL = baseURL + id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

                axios
                .get(URL)
                .then(({ data }) => {
                    if (data.data.count === 0) {
                        this.badLoad = true;
                    } else {
                        this.character = data.data.results[0];
                        this.noComics = data.data.results[0].comics.items.length === 0;
                        this.noSeries = data.data.results[0].series.items.length === 0;
                        this.badLoad = false;
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.badLoad = true;
                });
            }
        }
    },
    created() {
        this.getCharacter(this.$route.params.id);
    },
    watch: {
        $route() {
            this.getCharacter(this.$route.params.id);
        }
    }
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
a {
  color: #42b983;
}
span {
  text-align: center;
  max-width: 50%;
}
div {
  max-width: 50%;
  margin: 0 auto;
}
</style>