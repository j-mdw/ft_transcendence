<template>
  <v-card color="our_dark_beige" height="400" class="scrolla">
    <v-card-title class="our_beige our_navy_blue--text">
      <v-row align="center" justify="center">
        top players
      </v-row>
    </v-card-title>
    <v-row align="center" justify="center" class="mt-2 mb-n8 ml-4">
      <v-col>
        user
      </v-col>
      <v-col>
        victories
      </v-col>
      <v-col>
        defeats
      </v-col>
    </v-row>
    <v-list class="our_dark_beige">
      <div v-for="user in ranking" :key="user.title">
        <v-row align="center" justify="center" class="mt-2 mb-2 ml-4">
          <v-col>
            <div v-if="user.id == me.id">
              <v-list-item-avatar class="mt-4 mb-4">
                <v-img
                  :src="`/api/${user.avatarPath}`"
                />
              </v-list-item-avatar>
            </div>
            <div v-else>
              <router-link :to="`/profile/${user.id}`">
                <v-list-item-avatar class="mt-4 mb-4">
                  <v-img
                    :src="`/api/${user.avatarPath}`"
                  />
                </v-list-item-avatar>
              </router-link>
            </div>
          </v-col>
          <v-col class="ml-11">
            {{ user.victories }}
          </v-col>
          <v-col class="ml-4">
            {{ user.defeats }}
          </v-col>
        </v-row>
        <v-divider />
      </div>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { User } from '~/models';
import { usersStore, meStore } from '~/store'

export default Vue.extend({
  layout: 'default',
  computed: {
    ranking (): User[] {
      return usersStore.ranking;
    },

    me (): User { ///
      return meStore.me; //
    },

  },

  mounted () {
    usersStore.fetchUsers()
  },

  methods: {
  },

})

</script>

<style scoped lang="scss">
.scrolla {
   overflow-y: scroll;
   overflow-x: hidden !important;
}
</style>
