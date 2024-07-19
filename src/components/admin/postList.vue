<template>
  <div>
    <div class="handle-box">
      <el-select style="width: 140px" class="mrb10" v-model="pagination.blogSortUid" placeholder="请选择分类" @change="getTags">
        <el-option
          v-for="item in sorts"
          :key="item.uid"
          :label="item.sortName"
          :value="item.uid">
        </el-option>
      </el-select>
      <el-select style="width: 140px" class="mrb10" v-model="pagination.tagUid" placeholder="请选择标签" v-show="pagination.blogSortUid == '' ? false : true">
        <el-option
          v-for="item in tags"
          :key="item.uid"
          :label="item.content"
          :value="item.uid">
        </el-option>
      </el-select>
      <el-input v-model="pagination.title" placeholder="文章标题" class="handle-input mrb10"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchArticles()">搜索</el-button>
      <el-button type="danger" @click="clearSearch()">清除参数</el-button>
      <el-button type="primary" @click="$router.push({path: '/postEdit'})">新增文章</el-button>
    </div>
    <el-table :data="articles" border class="table" header-cell-class-name="table-header">
      <el-table-column prop="uid" label="uid" width="55" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="author" label="作者" align="center"></el-table-column>
      <el-table-column prop="title" label="文章标题" align="center"></el-table-column>
      <el-table-column prop="blogSort.sortName" label="分类" align="center"></el-table-column>
      <el-table-column prop="label" label="标签" align="center"></el-table-column>
      <el-table-column prop="clickCount" label="浏览量" align="center"></el-table-column>
      <el-table-column prop="likeCount" label="点赞数" align="center"></el-table-column>
      <el-table-column label="是否可见" align="center">
        <template slot-scope="scope">
          <el-switch @click.native="changeStatus(scope.row, 1)" v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="封面" align="center">
        <template slot-scope="scope">
          <el-image lazy class="table-td-thumb" :src="scope.row.coverpic" fit="cover"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="是否启用评论" align="center">
        <template slot-scope="scope">
          <el-switch @click.native="changeStatus(scope.row, 2)" v-model="scope.row.openComment" :active-value="1" :inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="commentCount" label="评论数" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="最终修改时间" align="center"></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="total, prev, pager, next"
                     :current-page="pagination.current"
                     :page-size="pagination.size"
                     :total="pagination.total"
                     @current-change="handlePageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        pagination: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          blogSortUid: "",
          tagUid: "",
          title: ""
        },
        articles: [],
        sorts: [],
        tags: [],
        labelsTemp: []
      }
    },

    computed: {},

    watch: {
      'pagination.sortId'(newVal) {
        this.pagination.labelId = null;
        if (!this.$common.isEmpty(newVal) && !this.$common.isEmpty(this.labels)) {
          this.labelsTemp = this.labels.filter(l => l.sortId === newVal);
        }
      }
    },

    created() {
      this.getArticles();
      this.getSort();
      this.getTags();
    },

    mounted() {
    },

    methods: {
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
        this.$http.get(this.$constant.baseURL + "/tag/getListByBlogSortUid", {blogSortUid: this.pagination.blogSortUid}, true)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.tags = res.data;
              console.log(this.tags)
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      clearSearch() {
        this.pagination = {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          blogSortUid: "",
          tagUid: "",
          title: ""
        }
        this.tags = "";
        this.getArticles();
      },
      getArticles() {
        this.$http.get(this.$constant.baseURL + "/blog/getAll", this.pagination, true)
          .then((res) => {
            if (!this.$common.isEmpty(res.code === 200)) {
              this.articles = res.rows;
              this.pagination.total = res.total;
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
        this.pagination.current = val;
        this.getArticles();
      },
      searchArticles() {
        this.pagination.total = 0;
        this.pagination.current = 1;
        this.getArticles();
      },
      changeStatus(article, flag) {
        let param;
        if (flag === 1) {
          param = {
            uid: article.uid,
            status: article.status
          }
        } else if (flag === 2) {
          param = {
            uid: article.uid,
            openComment: article.openComment
          }
        }
        this.$http.get(this.$constant.baseURL + "/admin/article/changeArticleStatus", param, true)
          .then((res) => {
            if (flag === 1) {
              this.$message({
                duration: 0,
                showClose: true,
                message: "修改成功！",
                type: "warning"
              });
            } else {
              this.$message({
                message: "修改成功！",
                type: "success"
              });
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      handleDelete(item) {
        this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success',
          center: true
        }).then(() => {
          this.$http.get(this.$constant.baseURL + "/article/deleteArticle", {id: item.id}, true)
            .then((res) => {
              this.pagination.current = 1;
              this.getArticles();
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
      handleEdit(item) {
        this.$router.push({path: '/postEdit', query: {id: item.id}});
      }
    }
  }
</script>

<style scoped>

  .handle-box {
    margin-bottom: 20px;
  }

  .handle-input {
    width: 160px;
    display: inline-block;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .mrb10 {
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
  }

  .pagination {
    margin: 20px 0;
    text-align: right;
  }

  .el-switch {
    margin: 5px;
  }
</style>
