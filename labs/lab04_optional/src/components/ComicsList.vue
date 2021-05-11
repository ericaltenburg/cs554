<template>
    <div>
        <div v-if="!badLoad">
            <div v-if="!isLastPage">
                <router-link :to="{path:'/comics/page/' + (pageNum+1)}">Next Page</router-link>
            </div>
            <br />
            <div v-if="pageNum !== 0">
                <router-link :to="{path:'/comics/page/' + (pageNum-1)}">Previous Page</router-link>
            </div>
            <ul>
                <li v-for="(comic,index) in comics" :key="index">
                    <router-link :to="{path:'/comics/'+comic.id}">{{comic.title}}</router-link>
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
const baseURL = 'https://gateway.marvel.com:443/v1/public/comics';
const URL = baseURL + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

export default {
    name: "ComicsList",
    data() {
        return {
            comics: [],
            isLastPage: null,
            pageNum: null,
            badLoad: null,
        };
    },
    methods: {
        getComicsList (page) {
            axios
            .get(`${URL}&offset=${parseInt(page)*20}`)
            .then(({ data }) => {
                if (data.data.count === 0) {
                    this.badLoad = true;
                } else {
                    this.comics = data.data.results;
                    this.badLoad = false;
                }
            });
            axios
            .get(`${URL}&offset=${(parseInt(page)+1)*20}`)
            .then(({ data }) => {
                if (data.data.count === 0){
                    this.isLastPage = true;
                }
            });
        },
        setPageNum (page) {
            this.pageNum = parseInt(page);
        }
    },
    created() {
        this.getComicsList(this.$route.params.page);
        this.setPageNum(this.$route.params.page);
    },
    watch: {
        $route() {
            this.getComicsList(this.$route.params.page);
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