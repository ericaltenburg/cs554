<template>
    <div>
        <div v-if="!this.badLoad">
            <h3>{{this.series.title}}</h3>
            <br />
            <img :src="this.series.thumbnail.path+'/portrait_incredible.'+this.series.thumbnail.extension" />
            <br />
            <h4>Description:</h4>
            <p v-if="!this.series.description">N/A</p>
            <span v-else v-html="this.series.description"></span>
            <br />
            <h4>Start Year</h4>
            <p v-if="!this.series.startYear">N/A</p>
            <span v-else v-html="this.series.startYear"></span>
            <br />
            <h4>End Year</h4>
            <p v-if="!this.series.endYear">N/A</p>
            <span v-else v-html="this.series.endYear"></span>
            <br />
            <h4>Creators:</h4>
            <ul v-if="!this.noCreators">
                <li v-for="person in this.series.creators.items" :key="person.resourceURI.match(/\d+$/)[0]">{{person.name}} - {{person.role}}</li>
            </ul>
            <p v-else>N/A</p>
            <h4>Comics Featured:</h4>
            <ul v-if="!this.noComics">
                <li v-for="comic_book in this.series.comics.items.slice(0,20)" :key="comic_book.resourceURI.match(/\d+$/)[0]">
                    <router-link :to="{path:'/comics/' + (comic_book.resourceURI.match(/\d+$/)[0])}">{{comic_book.name}}</router-link>
                </li>
            </ul>
            <p v-else>N/A</p>
            <h4>Characters Featured:</h4>
            <ul v-if="!this.noCharacters">
                <li v-for="character in this.series.characters.items.slice(0,20)" :key="character.resourceURI.match(/\d+$/)[0]">
                    <router-link :to="{path:'/characters/' + (character.resourceURI.match(/\d+$/)[0])}">{{character.name}}</router-link>
                </li>
            </ul>
            <p v-else>N/A</p>
        </div>
        <div v-else>
            <p>404 Error</p>
        </div>
        <br />
        <br />
        <router-link to="/series/page/0">Back to all series...</router-link>
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
const baseURL = `https://gateway.marvel.com:443/v1/public/series/`;

export default {
    name: "Series",
    data() {
        return {
            id: this.$route.params.id,
            series: {title: null, startYear: null, endYear: null, creators: { items: [] }, thumbnail: {}, description: null, comics: { items: [] }, characters: { items: []}},
            name: null,
            badLoad: null,
            noComics: null,
            noCharacters: null,
            noCreators: null,
        };
    },
    methods: {
        getSeries (id) {
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
                        this.series = data.data.results[0];
                        this.noComics = data.data.results[0].comics.items.length === 0;
                        this.noCharacters = data.data.results[0].characters.items.length === 0;
                        this.noCreators = data.data.results[0].creators.items.length === 0;
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
        this.getSeries(this.$route.params.id);
    },
    watch: {
        $route() {
            this.getSeries(this.$route.params.id);
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