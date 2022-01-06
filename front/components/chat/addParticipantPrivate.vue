<template>
    <div v-if="amIAdmin">
        <v-dialog
      v-model="dialog"
      width="600"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="#f5cac3" class="mt-6 mb-6 ml-6"
          v-bind="attrs"
          v-on="on"
        >
          add participant
        </v-btn>
      </template>

      <v-card class="our_beige" height="250">
        <v-card-title class="our_dark_beige our_navy_blue--text">
          enter the pseudo of the person you want to add
        </v-card-title>

        <v-form
    ref="form"
    lazy-validation
    title="Create a channel"
  >
    <v-text-field
      v-model="name"
      :counter="20"
      label="Name"
      required
      class="mr-4 ml-4"
    />


        <v-row align="center" justify="center">
        <v-btn
            v-if="name"
          color="success"
          class="mt-3 mb-5"
          @click="addUser"
        >
          Send
        </v-btn>
        <v-btn v-else disabled class="mt-3 mb-5">
          Send
        </v-btn>
        </v-row>
      </v-form>
      <div v-if="alertExist == true">
      <v-alert
        type="error"
        class=""
      >
         Sorry this user doesn't exist <br/>
        or he is already in the channel
      </v-alert>
      </div>
      </v-card>
    </v-dialog>
    
    
</div>
</template>


<script lang="ts">

import Vue from 'vue'
import {CreateChannelDTO} from '~/models/channel'

import {channelsStore, meStore, usersStore} from '~/store';
export default Vue.extend({
  props: ['channelId'],
  data() {
    return {
      participants: Object(),
      counter: this.channelId,
      name: '',
      dialog: false,
      alertExist: false,
      
    };
  },
  computed : {
    me () {
       return meStore.me;
     },

    amIAdmin: function (): any {   
       channelsStore.fetch()
      for (let i = 0; i < this.participants.length; i++) {
        if(this.participants[i].userId == this.me.id)
        {
          if(this.participants[i].admin)
            return(true);
          else 
            return false
        }
        
      }
      console.log("NOT found")
      return false
    },

    allUsers () {
      return usersStore.allUsers;
    }
  },
  async mounted () {
    channelsStore.fetch();
    this.participants = await this.$axios.$get(`channel/${this.channelId}`, { withCredentials: true });
  },
  methods: {
    doesHeExist() {
      for (let i = 0; i < this.allUsers.length; i++) {
        if(this.allUsers[i].pseudo === this.name)
          return this.allUsers[i].id;
      }
      return null
    },

    async addUser () {
      //forthis.allUsers.find(this.name)
      let id = this.doesHeExist()
      if(id)
      {
        await this.$axios.$put(`/channel/${this.channelId}/${id}`, '',{ withCredentials: true})
        .then((res) => {
          this.alertExist = true;
          this.dialog=false
        })
        .catch((err) => {
          console.log('there is an error');
          console.log(err);
          this.alertExist = true;
        });
        
      }
      else
      {
        this.alertExist = true;
      }
      channelsStore.fetch()

    }
  }
})
</script>

<style scoped lang="scss">

</style>
