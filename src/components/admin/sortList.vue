<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="sortDialog = true">新增分类</el-button>
    </div>
    <el-table :data="sortInfo" border class="table"  header-cell-class-name="table-header">
      <el-table-column type="index" label="ID" width="55" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sortName" label="分类名称" align="center"></el-table-column>
      <el-table-column prop="content" label="分类描述" align="center"></el-table-column>
      <el-table-column prop="status" label="启用状态" align="center"></el-table-column>
<!--      <el-table-column label="启用状态" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <el-switch @change="changeStatus(scope.row)"-->
<!--                     v-model="scope.row.status">-->
<!--          </el-switch>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="sort" label="分类优先级" align="center"></el-table-column>
      <el-table-column label="操作" width="380" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="editSort(scope.row)">
            编辑分类
          </el-button>
          <el-button type="text" icon="el-icon-edit" @click="sayLabel(scope.row)">
            查看标签
          </el-button>
          <el-button type="text" icon="el-icon-edit" @click="insertLabel(scope.row)">
            新增标签
          </el-button>
          <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)"
                     @click="deleteHandle(scope.row.id, 1)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-if="!$common.isEmpty(sort)" :data="sort.tagList" border class="table"
              style="margin-top: 40px"
              header-cell-class-name="table-header">
      <el-table-column type="index" label="ID" width="55" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="分类名称" align="center">
        <span>{{sort.sortName}}</span>
      </el-table-column>
      <el-table-column prop="content" label="标签名称" align="center"></el-table-column>
      <el-table-column prop="status" label="启用状态" align="center"></el-table-column>
<!--      <el-table-column label="启用状态" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <el-switch @change="changeStatus(scope.row)"-->
<!--                     v-model="scope.row.status">-->
<!--          </el-switch>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="clickCount" label="点击数" align="center"></el-table-column>
      <el-table-column prop="sort" label="优先级" align="center"></el-table-column>
      <el-table-column label="操作" width="320" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="editLabel(scope.row)">
            编辑标签
          </el-button>
          <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)"
                     @click="deleteHandle(scope.row.id, 2)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="分类"
               :visible.sync="sortDialog"
               width="30%"
               :before-close="handleClose"
               :append-to-body="true"
               destroy-on-close
               center>
      <div class="my-dialog">
        <el-input placeholder="请输入分类名称" v-model="sortForHttp.sortName">
          <template slot="prepend">分类名称</template>
        </el-input>
        <el-input placeholder="请输入分类描述" v-model="sortForHttp.content">
          <template slot="prepend">分类描述</template>
        </el-input>
        <el-input type="number" placeholder="请输入整数，数字小的在前面"
                  v-model="sortForHttp.sort">
          <template slot="prepend">分类优先级</template>
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="saveSortEdit()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="标签"
               :visible.sync="labelDialog"
               width="30%"
               :before-close="handleClose"
               :append-to-body="true"
               destroy-on-close
               center>
      <div class="my-dialog">
        <el-input placeholder="请输入标签名称" v-model="labelForHttp.content">
          <template slot="prepend">标签名称</template>
        </el-input>
        <el-input type="number" placeholder="请输入整数，数字小的在前面"
                  v-model="labelForHttp.sort">
          <template slot="prepend">分类优先级</template>
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="saveLabelEdit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        sortDialog: false,
        labelDialog: false,
        sortInfo: [],
        sort: {},
        sortForHttp: {
          uid: null,
          sortName: "",
          content: "",
          sort: "",
        },
        labelForHttp: {
          uid: null,
          blogSortUid: "",
          content: "",
          sort: ""
        }
      }
    },

    computed: {},

    watch: {},

    created() {
      this.getSortInfo();
    },

    mounted() {

    },

    methods: {
      changeStatus(blogsort){
        console.log(blogsort)
      },

      deleteHandle(id, flag) {
        let url;
        if (flag === 1) {
          url = "/webInfo/deleteSort";
        } else if (flag === 2) {
          url = "/webInfo/deleteLabel";
        } else {
          return;
        }
        this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success',
          center: true
        }).then(() => {
          this.$http.get(this.$constant.baseURL + url, {id: id}, true)
            .then((res) => {
              this.$message({
                message: "删除成功！",
                type: "success"
              });
              this.getSortInfo();
              this.sort = {};
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
      saveSortEdit() {
        if (this.$common.isEmpty(this.sortForHttp.sort) ||
          this.$common.isEmpty(this.sortForHttp.sortName) ||
          this.$common.isEmpty(this.sortForHttp.content)) {
          this.$message({
            message: "请完善所有分类信息！",
            type: "error"
          });
          return;
        }

        let url;
        if (this.$common.isEmpty(this.sortForHttp.uid)) {
          url = "/blogsort/insert";
        } else {
          url = "/blogsort/update";
        }
        this.$http.post(this.$constant.baseURL + url, this.sortForHttp, true)
          .then((res) => {
            if (res.code === 200){
              this.$message({
                message: "保存成功！",
                type: "success"
              });
              this.getSortInfo();
              this.handleClose();
            }else {
              this.$message({
                message: "保存失败！",
                type: "error"
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
      saveLabelEdit() {
        if (this.$common.isEmpty(this.labelForHttp.content)||
        this.$common.isEmpty(this.labelForHttp.sort)) {
          this.$message({
            message: "请完善所有标签信息！",
            type: "error"
          });
          return;
        }

        let url;
        if (this.$common.isEmpty(this.labelForHttp.uid)) {
          url = "/tag/insert";
        } else {
          url = "/tag/update";
        }
        this.$http.post(this.$constant.baseURL + url, this.labelForHttp, true)
          .then((res) => {
            if (res.code === 200){
              this.$message({
                message: "保存成功！",
                type: "success"
              });
              this.getSortInfo();
              this.handleClose();
              this.sort = {};
            }else {
              this.$message({
                message: "保存失败！",
                type: "error"
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
      editSort(sort) {
        this.sortDialog = true;
        this.sortForHttp.uid = sort.uid;
        this.sortForHttp.sortName = sort.sortName;
        this.sortForHttp.content = sort.content;
        this.sortForHttp.sort = sort.sort
      },
      editLabel(label) {
        this.labelDialog = true;
        this.labelForHttp.uid = label.uid;
        this.labelForHttp.blogSortUid = label.blogSortUid;
        this.labelForHttp.content = label.content;
        this.labelForHttp.sort = label.sort;
      },
      insertLabel(sort) {
        this.labelForHttp.blogSortUid = sort.uid;
        this.labelDialog = true;
      },
      handleClose() {
        this.labelForHttp = {
          uid: null,
          blogSortUid: null,
          content: "",
          sort: ""
        };
        this.sortForHttp = {
          uid: null,
          sortName: "",
          content: "",
          sort: ""
        };
        this.sortDialog = false;
        this.labelDialog = false;
      },
      sayLabel(sort) {
        this.sort = sort;
      },
      getSortInfo() {
        this.$http.get(this.$constant.baseURL + "/blogsort/getList")
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.sortInfo = res.data;
              console.log(this.sortInfo)
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      }
    }
  }
</script>

<style scoped>

  .my-dialog > div {
    margin: 12px;
  }

  .my-dialog >>> input::-webkit-inner-spin-button {
    appearance: none;
  }
</style>
