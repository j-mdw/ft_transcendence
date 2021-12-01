<template>
    <div>
        <v-navigation-drawer
        permanent
        expand-on-hover
        class="mt-10 py-2 ml-2"
      >
        <v-list>
          <v-list-item class="px-2">
            <v-list-item-avatar>
              <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                Sandra Adams
              </v-list-item-title>
              <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
      </v-navigation-drawer>
    </div>
</template>
    
<script lang="ts">
import Vue from 'vue'
import { authenticationStore }  from '~/store'

export default Vue.extend({
	layout: 'default',

	data() {
		items: [
        { name: 'Julien', status: 1 , avatarpath:'https://randomuser.me/api/portraits/women/85.jpg'},
        { name: 'Laurent', status: 0, avatarpath:'https://randomuser.me/api/portraits/women/85.jpg'},
        { name: 'Florianne', status: 2, avatarpath:'https://randomuser.me/api/portraits/women/85.jpg'}
    ]
	},
})
</script>

<style scoped lang="scss">

</style>