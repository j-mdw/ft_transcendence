<template>
<div>
  
    <v-btn color="#F6BD60" v-bind="attrs" v-on="on" to="/channels/create" class="mt-9 ml-8" >
      create channel
    </v-btn>

  
    <v-row no-gutters class="mt-4 mb-6 ml-4"  >
    <v-col  :key="index" v-for="(channel, index) in channels" >
      <v-list-item>
        <v-card width="500" height="50" class="mt-5" color="#ebd9c5">
          <v-row justify="center" align="center">
            <v-col>
              <v-list-item> {{ channel.name }} </v-list-item>
            </v-col>
            <v-col >
              <v-list-item-subtitle> 
                
                <div v-if="channel.type == 0"> 
                  public
                </div>
                <div v-if="channel.type == 1"> 
                  private
                </div>
                <div v-if="channel.type == 2"> 
                  protected
                </div>
              </v-list-item-subtitle>
            </v-col>
            <!-- <v-col>
            <v-btn
            class=""
            @click="deleteChannel(channel.id)"
            x-small
            >
              Delete Channel
            </v-btn>
            </v-col> -->
          </v-row>
        </v-card>
      </v-list-item>
    </v-col>
    </v-row>   
</div>
</template>

<script lang="ts">

import { ChannelDTO } from '~/models/channel'

import Vue from 'vue'
export default Vue.extend({
	data() {
		return {
			channels: Array<ChannelDTO>(),
		}
	},
  methods: {
    async createChannel() {

    },
    async deleteChannel(id: string) {
      await this.$axios.$delete('/channel', {params: {'id': id}, withCredentials: true});
      this.channels = await this.$axios.$get('/channel', {withCredentials: true}) 
    },
    async updateChannel() {},
  },
  async mounted() {
    this.channels = await this.$axios.$get('/channel', {withCredentials: true})
  },
})
</script>