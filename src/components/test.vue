<template>
  <div style="height:100%">
    <!-- <el-button type="primary" @click="test">测试</el-button> -->
    <el-dialog
      title="添加文件夹"
      :append-to-body="true"
      :visible.sync="fileDialog"
      width="650px"
      :close-on-click-modal="false"
    >
      <div>
        <input
          ref="file"
          class="fileUploaderClass"
          type="file"
          name="file"
          webkitdirectory
          @change.stop="changesData"
        />
        <p v-for="item in fileList" :key="item">{{item}}</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="fileDialog=false">取消</el-button>
          <el-button type="primary" @click="uploadFile">确定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      fileList: [],
      fileDialog: true
    };
  },
  mounted() {},
  methods: {
    init() {},
    changesData() {
      console.log(this.$refs.file.files);
      for (let i = 0; i < this.$refs.file.files.length; i++) {
        console.log(this.$refs.file.files[i]);
        this.fileList.push(this.$refs.file.files[i].webkitRelativePath);
      }
      // this.fileList = this.$refs.file.files;
    },
    uploadFile() {},
    test() {
      axios
        .post("http://localhost:9090/api/test", {
          test: "ttt"
        })
        .then(res => {
          console.log(res.data);
        });
    },
    test2() {
      let address = "深圳南头直升机场";
      axios
        .get(`https://restapi.amap.com/v3/geocode/geo`, {
          params: {
            key: "a00f52f1c3cf023c02d4cb983a04dc7f",
            address: address
          }
        })
        .then(res => {
          console.log(res.data);
        });
    }
  }
};
</script>