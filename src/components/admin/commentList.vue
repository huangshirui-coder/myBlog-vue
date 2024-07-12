<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-select v-model="queryComment.blogUid" placeholder="博客" style="margin-right: 10px">
        <el-option key="1" label="文章评论" value="article"></el-option>
        <el-option key="2" label="树洞留言" value="message"></el-option>
        <el-option key="3" label="家庭祝福" value="love"></el-option>
      </el-select>
      <el-input class="my-input" type="number" style="width: 140px;margin-right: 10px" v-model="queryComment.author"
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
        options: [],
        comments: [],
        sortArticles: {}
      }
    },

    computed: {},

    watch: {},

    created() {
      this.getComments();
      this.handle();
    },

    mounted() {
    },

    methods: {
      clearSearch() {
        this.queryComment = {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          author: "",
          blogUid: ""
        }
        this.getComments();
      },
      getComments() {
        this.$http.get(this.$constant.baseURL + "/comment/getListWithSearchParam", this.queryComment, true)
          .then((res) => {
            if (!this.$common.isEmpty(res.rows)) {
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
          this.$http.get(this.$constant.baseURL + "", {id: item.id}, true)
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
      getSortArticles() {
        this.$http.get(this.$constant.baseURL + "/blog/getSortArticles")
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
        for (var sort in sortInfo){
          var item = {
            value: "",
            label: "",
            childen: []
          }
          var childen = []
          if (sortArticles[sort.uid] != null){
            item.value = sort.uid
            item.label = sort.sortName
            for (var artcle in sortArticles[sort.uid]){
              childen.append({value: artcle.uid, label: artcle.title})
            }
            item.childen = childen
            this.options.append(item)
          }
        }
      },
      handle(){
        this.getSortArticles()
        this.doexchange(this.sortArticles)
        console.log(this.options)
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
