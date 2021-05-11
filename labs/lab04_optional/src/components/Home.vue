<template>
    <div>
            <p>
                This is a single page application showcasing vuejs to serve information from Marvel Comics such as the characters, comics, and series.
            </p>
            <router-link to="/characters/page/0">Characters</router-link>
            <br />
            <router-link to="/comics/page/0">Comics</router-link>
            <br />
            <router-link to="/series/page/0">Series</router-link>


            <p>
                This application queries 6 different end-points in the Marvel API:
                <br />
                <br />
                /v1/public/characters
                <br />
                <br />
                /v1/public/characters/{characterId}
                <br />
                <br />
                /v1/public/comics
                <br />
                <br />
                /v1/public/comics/{comicId}
                <br />
                <br />
                /v1/public/series
                <br />
                <br />
                /v1/public/series/{seriesId}
                <br />
                <br />
                {_Id}'s are specific Id's for characters, comics, or series.
            </p>
        </div>
</template>

<script>
export default {
    name: "Home"
}
</script>

<style scoped>

</style>