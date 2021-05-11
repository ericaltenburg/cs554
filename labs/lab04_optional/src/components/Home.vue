<template>
    <div>
            <p>
                This is a single page application showcasing vuejs to serve information from Marvel Comics such as the characters, comics, and series.
            </p>
            <router-link to="/characters/page/0">Characters</router-link>
            <router-link to="/comics/page/0">Comics</router-link>
            <router-link to="/series/page/0">Series</router-link>
        </div>
</template>

<script>
export default {
    name: "Home"
}
</script>

<style scoped>

</style>