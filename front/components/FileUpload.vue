<template>
  <div class="file-upload">
    <input type="file" @change="onFileChange" />
    <button @click="onUploadFile" class="upload-button"
    :disabled="!this.selectedFile">Upload file</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedFile: "",
    };
  },
  methods: {
    onFileChange(e) {
      const selectedFile = e.target.files[0]; // accessing file
      this.selectedFile = selectedFile;
    },
    onUploadFile() {
      const formData = new FormData();
      formData.append("file", this.selectedFile);  // appending file

     // sending file to the backend
      axios
        .post("http://localhost:4000/users/upload/avatar", formData)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>