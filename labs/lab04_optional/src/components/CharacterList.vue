<template>
    <div>
        <div v-if="!this.badLoad">
            <div v-if="!this.isLastPage">
                <router-link :to="{path:'/characters/page/' + (this.pageNum+1)}">Next Page</router-link>
            </div>
            <br />
            <div v-if="this.pageNum !== 0">
                <router-link :to="{path:'/characters/page/' + (this.pageNum-1)}">Previous Page</router-link>
            </div>
            <ul>
                <li v-for="(character,index) in this.characters" :key="index">
                    <router-link :to="{path:'/characters/'+character.id}">{{character.name}}</router-link>
                </li>
            </ul>
        </div>
        <div v-else>
            <p>404 Error</p>
        </div>
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
const baseURL = 'https://gateway.marvel.com:443/v1/public/characters';
const URL = baseURL + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

export default {
    name: "CharacterList",
    data() {
        return {
            characters: [],
            isLastPage: null,
            pageNum: null,
            badLoad: null,
        };
    },
    methods: {
        getCharacterList (page) {
            if (isNaN(parseInt(page)) || parseInt(page) < 0) {
                this.badLoad = true;
            } else {
                axios
                .get(`${URL}&offset=${parseInt(page)*20}`)
                .then(({ data }) => {
                    if (data.data.count === 0) {
                        this.badLoad = true;
                    } else {
                        this.characters = data.data.results;
                        this.badLoad = false;
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.badLoad = true;
                });
                
                axios
                .get(`${URL}&offset=${(parseInt(page)+1)*20}`)
                .then(({ data }) => {
                    if (data.data.count === 0){
                        this.isLastPage = true;
                    } else {
                        this.isLastPage = false;
                    }
                });
            }
        },
        setPageNum (page) {
            this.pageNum = parseInt(page);
        }
    },
    created() {
        this.getCharacterList(this.$route.params.page);
        this.setPageNum(this.$route.params.page);
    },
    watch: {
        $route() {
            this.getCharacterList(this.$route.params.page);
            this.setPageNum(this.$route.params.page);
        }
    }
};
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
ul li {
  padding: 20px;
  font-size: 1.3em;
  background-color: #e0edf4;
  border-left: 5px solid #3eb3f6;
  margin-bottom: 2px;
  color: #3e5252;
}
p {
  text-align: center;
  padding: 30px 0;
  color: gray;
}
</style>