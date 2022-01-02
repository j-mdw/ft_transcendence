<template>
  <v-container fill-height >
    <!-- <v-row no-gutters> -->
    <v-row justify="center" align="center">
      <v-col
        sm="3"
        align="center"
        justify="center"
      >
		<h1 v-if="user">
           <br>welcome {{ user.pseudo }} <br>wants to play or watch a game ?</h1>

        <v-row justify="center" align="center" class="mt-8">
        <v-btn color="#f5cac3" v-bind="attrs" v-on="on" to="/game/rules" class="mt-6" >
          game rules
          <v-icon color="#395c6b" right>fa fa-align-justify</v-icon>
        </v-btn>
        </v-row>

      </v-col>
      <v-col
        sm="9"
        align="center"
        justify="center"
      >
        <v-card
          class="pa-2 mb-7 mt-7"
          color="#F7C678"
          outlined
          align="center"
          max-width="500px"
        >
           <div> play or not ?</div>
			<div class="tab-row">
				<v-btn class="mt-6 tab-btn" color="#f5cac3" :class="{ active: activeRoom == 'none' }" @click="buttonClickPlay('none')"  >Spectator</v-btn>
				<v-btn class="mt-6 tab-btn" color="#f5cac3" :class="{ active: activeRoom == 'classic' }" @click="buttonClickPlay('classic')" >Classic</v-btn>
        		<v-btn class="mt-6 tab-btn" color="#f5cac3" :class="{ active: activeRoom == 'rookie' }"  @click="buttonClickPlay('rookie')" >Rookie</v-btn>
        		<v-btn class="mt-6 tab-btn" color="#f5cac3" :class="{ active: activeRoom == 'multiballs' }" @click="buttonClickPlay('multiballs')"  >Multiballs</v-btn>
		  </div>
		  <div>
			  <br> {{messagePlayer}} <br>
		  </div>
        </v-card>
        <v-card
          class="pa-2 mb-7 mt-7"
          color="#F7C678"
          outlined
          align="center"
          max-width="500px"
        >
          <div> watch a game?
          </div>
			<div class="tab-row">
				<v-btn class="mt-6 tab-btn" color="#f5cac3" @click="buttonClickWatch('classic')" >Classic</v-btn>
        		<v-btn class="mt-6 tab-btn" color="#f5cac3" @click="buttonClickWatch('rookie')" >Rookie</v-btn>
        		<v-btn class="mt-6 tab-btn" color="#f5cac3" @click="buttonClickWatch('multiballs')"  >Multiballs</v-btn>
		  </div>
			<div>
			  <br> {{messageWatch}} <br>
		  </div>
        </v-card>
        <!-- <v-card
          class="pa-2 mb-7 mt-7"
          color="#F7C678"
          outlined
          height="200px"
          align="center"
          max-width="500px"
        >
        MATCHES
        </v-card> -->


      </v-col>
    </v-row>

</v-container>
</template>


<script lang="ts">
import Vue from 'vue'
import { authenticationStore }  from '~/store'
import FileUpload from "~/components/FileUpload.vue";
import { User } from '~/models/user'

export default Vue.extend({
	layout: 'default',
	data() {
		return {
		user: Object(),
		messagePlayer: "",
		messageWatch: "",
		activeRoom: [
			"none",
			"classic",
			"rookie",
			"multiballs"
		]
		}
	},

	methods: {

	buttonClickPlay(gametype: string): void {
		this.activeRoom = gametype;
		if (gametype === 'none')
			this.messagePlayer = "choose the game you want to watch below";
		else {
			this.messagePlayer = 'bien recu';
		}
	},

	buttonClickWatch(gametype: string): void {
		this.messageWatch = `no ${gametype} game actually, please try another gametype or wait` ;
	},

	async mounted() {
      this.user = await this.$axios.$get("user/me", {withCredentials: true});
  		}
	}

})


</script>

<style scoped lang="scss">
#component-logo {
  margin-top: 25px;
  i{
    font-size: 32px;
  }
}


.tab-btn.active {
    color: goldenrod;
}
</style>