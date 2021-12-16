<template>
  <div>
    <a-row :gutter=[12,12]>
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <a-card style="text-align:center;">
          <a-upload-dragger
              name="file"
              :multiple="false"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              @change="handleChangeFile"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="file-text" />
            </p>
            <p class="ant-upload-text">
              点击或拖拽到此区域
            </p>
            <p class="ant-upload-hint">
              文档支持格式：.txt、.doc、.docx、.odf、.pdf、.ppt、.pptx、.ps、.rtf、.xls、.xlsx 等
            </p>
            <p class="ant-upload-hint">
              图片支持格式：.png、.bmp、.jpg、.jpeg、.gif 等
            </p>
          </a-upload-dragger>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "TranslateFile",
  methods: {
    handleChangeFile(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
  }
}
</script>

<style scoped>

</style>
