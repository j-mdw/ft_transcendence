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
          <v-list-item class="px-2 ml-n5">
            <v-list-item-avatar>
              <v-img :src="avatarUrl"></v-img>
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
          { name: 'Florianne', image: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
          { name: 'Laurent', image: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
          { name: 'Julien', image: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' },
        ],
        mini: true,
      }
    },
    computed: {
        avatarUrl() {
            return `http://localhost:4000/user/me/avatar?version=${this.version}`
        }
    },
    methods: {
        onPictureChanged() {
            this.version = Date.now()
        }
    }
  
})
</script>

<style scoped lang="scss">
.v-text{
  color: #fff
}

</style>