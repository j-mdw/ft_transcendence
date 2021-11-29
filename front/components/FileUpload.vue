<template>
  <div class="file-upload">
    <input type="file" @change="onFileChange" />
    <button @click="onUploadFile" class="upload-button">Upload file</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedFile: "",
      // user: Object(),
    };
  },
  methods: {
    onFileChange(e) {
      const selectedFile = e.target.files[0]; // accessing file
      this.selectedFile = selectedFile;
    },
    async onUploadFile() {
      const formData = new FormData();
      formData.append("file", this.selectedFile);  // appending file
      // this.user = await this.$axios.$get("user/me", {withCredentials: true});
      // console.log("ID =");
      // console.log(this.user.id);
     // sending file to the backend
     await axios
        .post("http://localhost:4000/user/upload/avatar", formData, { withCredentials: true})
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

};
</script>