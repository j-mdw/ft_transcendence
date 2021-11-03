<template>
  <v-container fill-height>
    <v-row justify="center" align="center">     
      <div id="component-auth" class="d-flex flex-column justify-center align-center">
          <h1>INDEX !!!</h1>
        
          
      </div>
    </v-row>
</v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'empty',
})
export default class Index extends Vue {
}
</script>

<style scoped lang="scss">
#component-logo {
  margin-top: 25px;
  i{
    font-size: 32px;
  }
}
</style>