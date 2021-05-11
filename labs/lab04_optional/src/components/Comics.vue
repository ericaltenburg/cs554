<template>
    <div>
        <div v-if="!badLoad">
            <h3>{{this.comics.title}}</h3>
            <br />
            <img :src="this.comics.thumbnail.path+'/portrait_incredible.'+this.comics.thumbnail.extension" />
            <br />
            <h4>Description:</h4>
            <p v-if="!this.comics.description">N/A</p>
            <span v-else v-html="this.comics.description"></span>
            <h4>Page Count:</h4>
            <p v-if="!this.comics.pageCount">N/A</p>
            <span v-else v-html="this.comics.pageCount"></span>
            <br />
            <h4>Creators:</h4>
            <ul v-if="!noCreators">
                <li v-for="person in this.comics.creators.items" :key="person.resourceURI.match(/\d+$/)[0]">{{person.name}} - {{person.role}}</li>
            </ul>
            <p v-else>N/A</p>
            <h4>Characters Featured:</h4>
            <ul v-if="!noCharacters">
                <li v-for="character in this.comics.characters.items.slice(0,20)" :key="character.resourceURI.match(/\d+$/)[0]">
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
        <router-link to="/comics/page/0">Back to all comics...</router-link>
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
const baseURL = `https://gateway.marvel.com:443/v1/public/comics/`;

export default {
    name: "Comics",
    data() {
        return {
            id: this.$route.params.id,
            comics: {title: null, pageCount: null, creators: { items: [] }, thumbnail: {}, description: null, characters: { items: [] }},
            name: null,
            badLoad: null,
            noCharacters: null,
            noCreators: null,
        };
    },
    methods: {
        getComics (id) {
            const URL = baseURL + id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

            axios
            .get(URL)
            .then(({ data }) => {
                if (data.data.count === 0) {
                    this.badLoad = true;
                } else {
                    this.comics = data.data.results[0];
                    this.noCharacters = data.data.results[0].characters.items.length === 0;
                    this.noCreators = data.data.results[0].creators.items.length === 0;
                    this.badLoad = false;
                }
            });
        }
    },
    created() {
        this.getComics(this.$route.params.id);
    },
    watch: {
        $route() {
            this.getComics(this.$route.params.id);
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