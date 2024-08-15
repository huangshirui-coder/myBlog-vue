<template>
  <div>
    <el-tag effect="dark" class="my-tag">
      <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -3px;">
        <path d="M0 0h1024v1024H0V0z" fill="#202425" opacity=".01"></path>
        <path
          d="M682.666667 204.8h238.933333a34.133333 34.133333 0 0 1 34.133333 34.133333v648.533334a68.266667 68.266667 0 0 1-68.266666 68.266666h-204.8V204.8z"
          fill="#FFAA44"></path>
        <path
          d="M68.266667 921.6a34.133333 34.133333 0 0 0 34.133333 34.133333h785.066667a68.266667 68.266667 0 0 1-68.266667-68.266666V102.4a34.133333 34.133333 0 0 0-34.133333-34.133333H102.4a34.133333 34.133333 0 0 0-34.133333 34.133333v819.2z"
          fill="#11AA66"></path>
        <path
          d="M238.933333 307.2a34.133333 34.133333 0 0 0 0 68.266667h136.533334a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h409.6a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h204.8a34.133333 34.133333 0 1 0 0-68.266667H238.933333z"
          fill="#FFFFFF"></path>
      </svg>
      文章信息
    </el-tag>
    <el-form :model="article" :rules="rules" ref="ruleForm" label-width="150px"
             class="demo-ruleForm">
      <el-form-item label="标题" prop="title">
        <el-input maxlength="30" v-model="article.title"></el-input>
      </el-form-item>

      <el-form-item label="视频链接" prop="videoUrl">
        <el-input maxlength="1000" v-model="article.videoUrl"></el-input>
      </el-form-item>

      <el-form-item label="简介" prop="summary">
        <el-input type="text" maxlength="30" v-model="article.summary"></el-input>
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <mavon-editor ref="md" @imgAdd="imgAdd" v-model="article.content"/>
      </el-form-item>

      <el-form-item label="是否启用评论" prop="openComment">
        <el-switch :active-value="1" :inactive-value="0" v-model="article.openComment"></el-switch>
      </el-form-item>

      <el-form-item label="是否可见" prop="status">
        <el-switch :active-value="1" :inactive-value="0" v-model="article.status"></el-switch>
      </el-form-item>

      <el-form-item label="封面" prop="coverpic">
        <div style="display: flex">
          <el-input v-model="article.coverpic"></el-input>
          <el-image class="table-td-thumb"
                    lazy
                    style="margin-left: 10px"
                    :preview-src-list="[article.coverpic !== '' ? article.coverpic : 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg']"
                    :src="article.coverpic !== '' ? article.coverpic : 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'"
                    fit="cover"></el-image>
        </div>
        <uploadPicture :isAdmin="true" :prefix="'articleCover'" style="margin-top: 10px" @addPicture="addArticleCover"
                       :maxSize="2"
                       :maxNumber="1"></uploadPicture>
      </el-form-item>
      <el-form-item label="分类" prop="blogSortUid">
        <el-select v-model="article.blogSortUid" placeholder="请选择分类" @change="getTags">
          <el-option
            v-for="item in sorts"
            :key="item.uid"
            :label="item.sortName"
            :value="item.uid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="tagUid">
        <el-select v-model="article.tagUid" multiple placeholder="请选择标签">
          <el-option
            v-for="item in tags"
            :key="item.uid"
            :label="item.content"
            :value="item.uid">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="myCenter" style="margin-bottom: 22px">
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      <el-button type="danger" @click="resetForm('ruleForm')">重置所有修改</el-button>
    </div>
  </div>
</template>

<script>
  const uploadPicture = () => import( "../common/uploadPicture");

  export default {
    components: {
      uploadPicture
    },
    data() {
      return {
        item: null,
        article: {
          title: "",
          summary: "",
          content: "",
          openComment: 1,
          status: 1,
          coverpic: "",
          videoUrl: "",
          blogSortUid: null,
          tagUid: null
        },
        sorts: [],
        tags: [],
        labelsTemp:[],
        rules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'change'}
          ],
          content: [
            {required: true, message: '请输入内容', trigger: 'change'}
          ],
          openComment: [
            {required: true, message: '是否启用评论', trigger: 'change'}
          ],
          status: [
            {required: true, message: '是否可见', trigger: 'change'}
          ],
          coverpic: [
            {required: true, message: '封面', trigger: 'change'}
          ],
          blogSortUid: [
            {required: true, message: '分类', trigger: 'change'}
          ],
          tagUid: [
            {required: true, message: '标签', trigger: 'blur'}
          ]
        }
      }
    },

    computed: {

    },

    watch: {
      'article.blogSortUid'(newVal, oldVal) {
        if (oldVal !== null) {
          this.article.tagUid = null;
        }
      },
      'article.tagUid'(newVal, oldVal){
        if (newVal !== null){
        }
      }
    },

    created() {
      this.setValue();
      this.getSort();
    },

    mounted() {
      this.getBlog();
      this.getTags();
      this.getSort();
    },

    methods: {
      setValue(){
        try {
          // 确保 this.$route.query.item 是一个字符串并且不为空
          if (this.$route.query.item && typeof this.$route.query.item === 'string') {
            this.item = JSON.parse(this.$route.query.item);
          }
        } catch (error) {
          // 如果解析失败，你可以记录错误，并保持 item 的默认值（这里是 null）
          console.error('Failed to parse item:', error);
        }
      },
      getBlog(){
        if (this.item !== undefined && this.item !== "" && this.item !== null){
          this.article = this.item;
          this.article.tagUid = (this.article.tagUid || "").toString().split(",");
        }
      },
      getSort() {
        this.$http.get(this.$constant.baseURL + "/blogsort/getList",null, true)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.sorts = res.data;
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      getTags() {
        if (this.article.blogSortUid !== "" && this.article.blogSortUid !== null){
          this.$http.get(this.$constant.baseURL + "/tag/getListByBlogSortUid", {blogSortUid: this.article.blogSortUid}, true)
            .then((res) => {
              if (!this.$common.isEmpty(res.data)) {
                this.tags = res.data;
              }
            })
            .catch((error) => {
              this.$message({
                message: error.message,
                type: "error"
              });
            });
        }
      },
      imgAdd(pos, file) {
        let suffix = "";
        if (file.name.lastIndexOf('.') !== -1) {
          suffix = file.name.substring(file.name.lastIndexOf('.'));
        }
        let key = "articlePicture" + "/" + this.$store.state.currentAdmin.id.replace(/[^a-zA-Z]/g, '') + new Date().getTime() + Math.floor(Math.random() * 1000) + suffix;

        let storeType = localStorage.getItem("defaultStoreType");

        let fd = new FormData();
        fd.append("file", file);
        fd.append("originalName", file.name);
        fd.append("key", key);
        fd.append("relativePath", key);
        fd.append("type", "articlePicture");
        fd.append("storeType", storeType);
        this.saveLocal(pos, fd);

      },
      saveLocal(pos, fd) {
        this.$http.upload(this.$constant.baseURL + "/resource/upload", fd, true)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              let url = res.data;
              this.$refs.md.$img2Url(pos, url);
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },

      addArticleCover(res) {
        this.article.coverpic = res;
      },
      getArticle() {
        this.$http.get(this.$constant.baseURL + "/blog/selectOneByUid", {uid: this.item.uid}, true)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.article = res.data;
              this.article.tagUid = (this.article.tagUid || "").toString().split(",");
              console.log("getAt:", this.article.tagUid)
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.article.tagUid = this.article.tagUid.join(",");
            if (this.$common.isEmpty(this.id)) {
              this.saveArticle(this.article, "/blog/insertOne")
            } else {
              this.article.uid = this.id;
              this.saveArticle(this.article, "/blog/updateOne")
            }
          } else {
            this.$message({
              message: "请完善必填项！",
              type: "error"
            });
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        if (!this.$common.isEmpty(this.item)) {
          this.getArticle();
        }
      },
      saveArticle(value, url) {
        this.$confirm('确认保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success',
          center: true
        }).then(() => {
          this.$http.post(this.$constant.baseURL + url, value, true)
            .then((res) => {
              this.$message({
                message: "保存成功！",
                type: "success"
              });
              this.$router.push({path: '/postList'});
            })
            .catch((error) => {
              this.$message({
                message: error.message,
                type: "error"
              });
            });
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '已取消保存!'
          });
        });
      }
    }
  }
</script>

<style scoped>

  .my-tag {
    margin-bottom: 20px;
    width: 100%;
    text-align: left;
    background: var(--lightYellow);
    border: none;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: var(--black);
  }

  .table-td-thumb {
    border-radius: 2px;
    width: 40px;
    height: 40px;
  }

  .el-switch {
    margin-left: 10px;
  }

  .el-form-item {
    margin-bottom: 40px;
  }
</style>
