<template>
 <div>
        <v-col>
          <!-- <v-btn color="#f5cac3" class="mt-6">
          settings
          <v-icon color="#395c6b" right>
            fa fa-cog
          </v-icon>
          </v-btn> -->
          <v-dialog
      v-model="dialog"
      width="50%"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-btn color="#f5cac3" class="mr-6"
          v-bind="attrs"
          v-on="on"
        >
          settings
        </v-btn>
      </template>

      <v-card class="our_beige">
        <v-card-title class="our_dark_beige our_navy_blue--text">
          Channel Settings
        </v-card-title>

        

        <v-divider></v-divider>
        <v-row justify="center" align="center">
          <v-btn
            v-btn color="#f5cac3" class="mt-6 mb-6" 
          >
            Leave channel
          </v-btn>
        </v-row>

        <v-divider></v-divider>
        <v-card-title class="our_dark_beige our_navy_blue--text">
          Channel Participants
        </v-card-title>
        <participant-chat/>
        
      </v-card>
    </v-dialog>

        </v-col>
  

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ParticipantChat from './ParticipantChat.vue'
export default Vue.extend({
  components: { ParticipantChat },
  layout: 'default',
  data () {
    return {
      messages: Array<string>(),
      current_message: ''
    }
  },
  mounted () {

  },
  methods: {
  }
})
</script>

<style scoped lang="scss">


</style>

