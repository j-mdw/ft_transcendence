<template>
  <div class="mt-5">
    <v-list class="our_beige">
      <div v-for="participant in participants" :key="participant.userId">
            <v-list-item class="ml-n3">
              <v-badge
                bottom
                :color="colors[getStatus(participant.userId)]"
                offset-x="30"
                offset-y="30"
              >
              <router-link :to="`/profile/${participant.userId}`">
                <v-list-item-avatar class="mt-4 mb-4">
                  <v-img
                    :src="`http://localhost:4000/${getAvatar(participant.userId)}`"
                  />
                </v-list-item-avatar>
              </router-link>
              </v-badge>
              <v-list-item-content>
                <v-list-item-title class="our_navy_blue--text" v-text="getPseudo(participant.userId)" />
              </v-list-item-content>
            </v-list-item>
      </div>
    </v-list>   
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Relationship, User } from "~/models";
import { usersStore, meStore, relationshipStore } from "~/store";
import messageLogo from "../../../components/Logo/messageLogo.vue";
import pingpongLogo from "../../../components/Logo/pingpongLogo.vue";
export default Vue.extend({
  components: { messageLogo, pingpongLogo },
  props: ['channelId'],
  data() {
    return {
      drawer: true,
      version: 0,
      mini: true,
      colors: ["#AFE796", "#F7F4E8", "#C596E7"],
      participants: Object(),
    };
  },
  async mounted () {
    this.participants = await this.$axios.$get(`channel/${this.channelId}`, { withCredentials: true });
    
  },
  methods: {
    getAvatar(peerId: string) {
        return usersStore.oneUser(peerId).avatarPath;
    },
    getPseudo(peerId: string)
    {
        return usersStore.oneUser(peerId).pseudo;
    },
    getStatus(peerId: string)
    {
        return usersStore.oneUser(peerId).status;
    }
  },
  computed: {
    relationships(): Relationship[] {
      return relationshipStore.all;
    },
    users (): User[] {
      return usersStore.allUsers;
    },
    me (): User {
      return meStore.me;
    },
    
  },
});
</script>

<style scoped lang="scss">
.v-text {
  color: #fff;
}
</style>