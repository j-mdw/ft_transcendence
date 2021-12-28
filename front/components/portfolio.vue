<template>
  <v-container>
    <div id="conponent-profile" class="d-flex flex-column justify-center align-center">
      <img src="~assets/img/sample.jpg">
      <h1>{{ name }}</h1>
      <h1>{{ notes }}</h1>
      <p>{{ description }}</p>
      <i class="fab fa-stack-overflow" />
      <i class="fab fa-linkedin" />
      <i class="far fa-envelope" />
    </div>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      name: 'florianne',
      description: 'I am'
    }
  },
  methods: {
    async loadUsers () {
      const notes = await this.$axios.$get('https://localhost:4000/notes');
      this.notes = notes
    }
  }
}
</script>

<style scoped lang="scss">
#conponent-profile {
    height: 100vh;
    img {
        max-width: 100px;
        border-radius: 100px;
    }
    i {
        font-size: 44px;
        color: teal;
    }
}
</style>
