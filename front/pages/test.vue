<template>
  
  <div>
    <h1>Mountaiins</h1>
    <ul v-for="mountain in mountains" :key="mountain.slug">
      <li>{{ mountain.title }}</li>
    </ul>
  </div>

</template>

<script>
import Portfolio from "~/components/portfolio"
export default {
  components:{
    Portfolio
  },
  async asyncData({ $axios, $config }) {
    const mountains = await $axios.$get(`/notes`)
    return { mountains }
  }
}
</script>

<style>

</style>