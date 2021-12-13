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
            <v-badge
              bottom
              color="#AFE796"
              offset-x="30"
              offset-y="30"
            >
              <v-list-item-avatar>
                <v-img src="http://localhost:4000/user/me/avatar"></v-img>
              </v-list-item-avatar>
            </v-badge>
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
            <v-badge
              bottom
              color="#AFE796"
              offset-x="30"
              offset-y="30"
            >
            <v-list-item-avatar class="mt-4 mb-4">
              <v-img
                :src="`http://localhost:4000/${item.avatarPath}`"
              ></v-img>
            </v-list-item-avatar>
          </v-badge>
            <v-list-item-content>
              <v-list-item-title v-text="item.pseudo" class="our_navy_blue--text" ></v-list-item-title>
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
        items: this.$store.getters['users/allUsers'],
        //  [
        //   { name: 'Florianne', image: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
        //   { name: 'Laurent', image: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
        //   { name: 'Julien', image: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' },
        // ],
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