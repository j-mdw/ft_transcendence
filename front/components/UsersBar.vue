<template>
    <div>
        <v-navigation-drawer
          class="our_dark_beige"
          app
          permanent
          expand-on-hover
        >
        <v-list>
          <v-list-item class="px-2 ml-n5">
            <v-list-item-avatar>
              <v-img src="http://localhost:4000/user/me/avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item to=/profile>
              My Profile
            </v-list-item>
          </v-list-item>

          
        </v-list>

      <v-divider></v-divider>
    
      <v-list>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            class="ml-n7"
          > 
           <div v-if="item.connected == 0">
            <v-badge
              bottom
              color = "#F7F4E8"
              offset-x="30"
              offset-y="30"
            >
          
            <v-list-item-avatar class="mt-4 mb-4">
              <v-img
                :src=item.image
              ></v-img>
            </v-list-item-avatar>
          </v-badge>
        </div>
        <div v-if="item.connected == 1">
            <v-badge
              bottom
              color = "#C596E7"
              offset-x="30"
              offset-y="30"
            >
          
            <v-list-item-avatar class="mt-4 mb-4">
              <v-img
                :src=item.image
              ></v-img>
            </v-list-item-avatar>
          </v-badge>
        </div>
        <div v-if="item.connected == 2">
            <v-badge
              bottom
              color = "#AFE796"
              offset-x="30"
              offset-y="30"
            >
          
            <v-list-item-avatar class="mt-4 mb-4">
              <v-img
                :src=item.image
              ></v-img>
            </v-list-item-avatar>
          </v-badge>
        </div>
            <v-list-item-content>
              <v-list-item-title v-text="item.name" class="our_navy_blue--text" ></v-list-item-title>
            </v-list-item-content>
            <!-- <v-list-item-avatar class="mt-4  mb-4" tile >
                <img  src="../assets/svg/message.svg" />
            </v-list-item-avatar> -->

            <v-list-item-action>
              <v-btn v-ripple="false" plain  to="/channels">
                  <messageLogo/>
              </v-btn>
            </v-list-item-action>
              
            <v-list-item-action>
              <v-btn v-ripple="false" plain  icon>
                <pingpongLogo/>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          
        </v-list>
          
      </v-navigation-drawer>
    </div>
</template>
    
<script lang="ts">
import Vue from 'vue'
import { authenticationStore }  from '~/store'
import messageLogo from './Logo/messageLogo.vue'
import pingpongLogo from './Logo/pingpongLogo.vue'

export default Vue.extend({
  components: { messageLogo, pingpongLogo},
	data () {
      return {
        drawer: true,
        version: 0,
        items: [
          { name: 'Florianne', image: 'https://cdn.vuetifyjs.com/images/lists/2.jpg', connected: 1 }, // 1 = in game
          { name: 'Laurent', image: 'https://cdn.vuetifyjs.com/images/lists/3.jpg', connected: 0 }, //0 = not connected
          { name: 'Julien', image: 'https://cdn.vuetifyjs.com/images/lists/4.jpg', connected: 2 }, //2 = connected
        ],
        mini: true,
      }
    },
  
  computed: {
  }
})
</script>

<style scoped lang="scss">
.v-text{
  color: #fff
}

</style>