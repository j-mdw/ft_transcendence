<template>
  <v-container justify="center" align="center">
    <input type="file" @change="onFileChange" class="custom-file-input" />
    <button @click="onUploadFile" class="upload-button">Upload file</button>
  </v-container>
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
      formData.append("file", this.selectedFile); // appending file
      // this.user = await this.$axios.$get("user/me", {withCredentials: true});
      // console.log("ID =");
      console.log(formData);
      await axios
        .delete("http://localhost:4000/user/delete/avatar", {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      await axios
        .post("http://localhost:4000/user/upload/avatar", formData, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      this.$emit("change");
    },
  },
};
</script>

<style scoped lang="scss">
.custom-file-input::-webkit-file-upload-button {
  // visibility: hidden;
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
}

// .upload-butto:hover  {
//   background-color: #f5cac3;
// }
</style>