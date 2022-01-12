<template>
  <v-container justify="center" align="center">
    <input type="file" class="custom-file-input" @change="onFileChange">
    <!-- <v-btn
            v-if="name"
          color="success"
          class="mt-3 mb-5"
          @click="addUser"
        >
          Send
        </v-btn>
        <v-btn v-else disabled class="mt-3 mb-5">
          Send
        </v-btn> -->
    <button v-if="selectedFile" class="upload-button" @click="onUploadFile">
      Upload file
    </button>
    <button v-else disabled class="upload-button">
      no file provided
    </button>
    
  </v-container>
</template>

<script>
import axios from 'axios';
import { meStore } from '~/store';

export default {
  data () {
    return {
      selectedFile: '',
    
    };
  },
  methods: {
    onFileChange (e) {
      const selectedFile = e.target.files[0]; // accessing file
      this.selectedFile = selectedFile;
    },
    async onUploadFile () {
      const formData = new FormData();
      formData.append('file', this.selectedFile); // appending file
      console.log('Uploading file:', formData); // DELETE
      await axios.delete('/api/user/delete/avatar', {
        withCredentials: true,
      });

      await axios.post('/api/user/upload/avatar', formData, {
        withCredentials: true,
      });
      meStore.fetch();
      this.$emit('change');
      
      
      
    },
  },
};
</script>

<style scoped lang="scss">
.custom-file-input::-webkit-file-upload-button {
  background-color: #f5cac3;
  border: none;
  width: 150px;
  border-radius: 1rem;
  color: #395c6b;
  &:hover {
    background-color: #f28482;
  }
}

.custom-file-input {
  color: #395c6b;
}

.upload-button {
  background-color: #f5cac3;
  border: none;
  width: 150px;
  border-radius: 1rem;
  color: #395c6b;
  margin-left: 80px;
  &:hover {
    background-color: #f28482;
  }
  &:disabled {
    background-color: #fff;
  }
}

</style>
