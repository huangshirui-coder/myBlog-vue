<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-cascader
        v-model="blogUidTmp"
        :options="options"
        @change="show">
      </el-cascader>
      <el-input class="my-input" style="width: 140px;margin-right: 10px" v-model="queryComment.author"
                placeholder="评论人"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchComments()">搜索</el-button>
      <el-button type="danger" @click="clearSearch()">清除参数</el-button>
    </div>
    <el-table :data="comments" border class="table" header-cell-class-name="table-header">
      <el-table-column type="index" label="ID" width="55" align="center"></el-table-column>
      <el-table-column prop="author" label="发表用户用户名" align="center"></el-table-column>
      <el-table-column prop="likeCount" label="点赞数" align="center"></el-table-column>
      <el-table-column prop="content" label="评论内容" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="total, prev, pager, next"
                     :current-page="queryComment.pageNum"
                     :page-size="queryComment.pageSize"
                     :total="queryComment.total"
                     @current-change="handlePageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        queryComment: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          author: "",
          blogUid: "",
        },
        blogUidTmp: "",
        options: [],
        comments: [],
        sortArticles: null
      }
    },

    computed: {},

    watch: {},

    created() {
      this.getComments();
      this.handle();
      console.log(this.options)
    },

    mounted() {
    },

    methods: {
      show(){
        console.log(this.queryComment.blogUid)
      },
      clearSearch() {
        this.queryComment = {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          author: "",
          blogUid: ""
        }
        this.blogUidTmp = ""
        this.getComments();
      },
      getComments() {
        this.queryComment.blogUid = this.blogUidTmp[this.blogUidTmp.length - 1]
        this.$http.get(this.$constant.baseURL + "/comment/getListWithSearchParam", this.queryComment, true)
          .then((res) => {
            if (res.code === 200) {
              this.comments = res.rows;
              this.queryComment.total = res.total;
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      handlePageChange(val) {
        this.queryComment.pageNum = val;
        this.getComments();
      },
      searchComments() {
        this.queryComment.total = 0;
        this.queryComment.pageNum = 1;
        this.getComments();
      },
      handleDelete(item) {
        this.$confirm('删除评论后，所有该评论的回复均不可见。确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success',
          center: true
        }).then(() => {
          this.$http.get(this.$constant.baseURL + "/comment/delete", {uid: item.uid}, true)
            .then((res) => {
              this.queryComment.pageNum = 1;
              this.getComments();
              this.$message({
                message: "删除成功！",
                type: "success"
              });
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
            message: '已取消删除!'
          });
        });
      },
      async getSortArticles() {
        await this.$http.get(this.$constant.baseURL + "/blog/getSortArticles")
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.sortArticles = res.data;
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      doexchange(sortArticles){
        var sortInfo = this.$store.state.sortInfo
        for (const sort of sortInfo) {
          var item = {
            value: "",
            label: "",
            children: []
          }
          if (sortArticles[sort.uid] != null){
            item.value = sort.uid
            item.label = sort.sortName
            for (const artcle of sortArticles[sort.uid]){
              item.children.push({value: artcle.uid, label: artcle.title})
            }
            this.options.push(item)
          }
        }
      },
      async handle(){
        await this.getSortArticles()
        this.doexchange(this.sortArticles)
      }
    }
  }
</script>

<style scoped>

  .pagination {
    margin: 20px 0;
    text-align: right;
  }

  .my-input >>> input::-webkit-inner-spin-button {
    appearance: none;
  }
</style>
