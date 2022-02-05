<template>
<div>
  <img :src="base64Src" width="400"/>
</div>
</template>

<script>
import {PostTransDownFile} from "../../services/translate";

export default {
  name: "picPreview",
  props: ["id"],
  data() {
    return {
      base64Src: ""
    }
  },
  created() {
    this.fetchPicPreview(this.id)
  },
  methods: {
    async fetchPicPreview(id) {
      return new Promise((resolve, reject) => {
        PostTransDownFile({id, type: 0})
            .then((res) => {
              let url = window.URL.createObjectURL(res.data);
              this.base64Src = url
              resolve(url)
            })
            .catch((err) => {
              this.$message.error(err.message);
              reject(err.message)
            })
      })
    }
  }
}
</script>

<style scoped>

</style>
