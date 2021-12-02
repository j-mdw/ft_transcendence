<template>
    <div>
        <v-navigation-drawer
          class="our_dark_beige"
          app
          permanent
          expand-on-hover
        >

        <!-- <user-bar-profile/>
        <v-list>
          <v-list-item class="px-2">
            <v-list-item-avatar>
              <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
            </v-list-item-avatar>
          </v-list-item>

        </v-list> -->

      <v-list>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            class="ml-n7"
          >
            <v-badge
              bottom
              color="#AFE796"
              offset-x="30"
              offset-y="30"
            >
            <v-list-item-avatar class="mt-4 mb-4">
              <v-img
                :src=item.image
              ></v-img>
            </v-list-item-avatar>
          </v-badge>
            <v-list-item-content>
              <v-list-item-title v-text="item.name" class="our_navy_blue--text" ></v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon color="#AFE796" right>fa fa-comment-alt</v-icon>  
            </v-list-item-icon>
              
            <v-list-item-avatar class="mt-4 mb-4" tile>
              <img  src="../assets/svg/pingpong.svg" />
            </v-list-item-avatar>
          </v-list-item>
          
        </v-list>
          
      </v-navigation-drawer>
    </div>
</template>
    
<script lang="ts">
import Vue from 'vue'
import { authenticationStore }  from '~/store'

export default Vue.extend({
	data () {
      return {
        drawer: true,
        items: [
          { name: 'Florianne', image: 'http://localhost:4000/user/me/avatar' },
          { name: 'Laurent', image: 'http://localhost:4000/user/me/avatar' },
          { name: 'Julien', image: 'http://localhost:4000/user/me/avatar' },
        ],
        mini: true,
      }
    },
})
</script>

<style scoped lang="scss">
.v-text{
  color: #fff
}
</style>