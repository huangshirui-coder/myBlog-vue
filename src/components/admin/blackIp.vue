<template>
  <div>
    <div class="handle-box">
      <el-date-picker
        v-model="pagination.stopTime"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择日期时间">
      </el-date-picker>
      <el-input v-model="pagination.blackIp" placeholder="IP地址" class="handle-input mrb10"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchBlackIp()">搜索</el-button>
      <el-button type="danger" @click="clearSearch()">清除参数</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleUpdateOrAdd('add')">新增</el-button>
    </div>
    <el-table :data="blackIps" border class="table" header-cell-class-name="table-header">
      <el-table-column prop="blackId" label="id" width="55" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="blackIp" label="IP地址" align="center"></el-table-column>
      <el-table-column prop="blackReason" label="封禁原因" align="center"></el-table-column>
      <el-table-column prop="stopTime" label="封禁截止时间" align="center"></el-table-column>
      <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
      <el-table-column prop="createBy" label="操作者" align="center"></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleUpdateOrAdd('edit', scope.row)">编辑时间</el-button>
          <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title"
               :visible.sync="visible"
               width="30%"
               :before-close="handleCancel"
               :append-to-body="true"
               destroy-on-close
               center>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="封禁IP" prop="blackIp">
          <el-input v-model="form.blackIp" :disabled="disable"></el-input>
        </el-form-item>

        <el-form-item label="封禁原因" prop="blackReason">
          <el-input v-model="form.blackReason" type="textarea" :disabled="disable"></el-input>
        </el-form-item>

        <el-form-item label="解封时间" prop="stopTime">
          <el-date-picker
            v-model="form.stopTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </div>
    </el-dialog>


    <div class="pagination">
      <el-pagination background layout="total, prev, pager, next"
                     :current-page="pagination.pageNum"
                     :page-size="pagination.pageSize"
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
      type: '',
      disable: false,
      visible: false,
      title: '',
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        blackIp: "",
        stopTime: undefined,
      },
      form:{
        blackId: undefined,
        blackIp: undefined,
        blackReason: undefined,
        stopTime: undefined
      },
      blackIps: [],
      rules: {
        blackIp: [
          {required: true, message: '请输入Ip地址', trigger: 'blur'}
        ],
        stopTime: [
          {required: true, message: '请输入封禁截止时间', trigger: 'blur'}
        ]
      }
    }
  },

  computed: {},

  watch: {
  },

  created() {
    this.getBlackIp();
  },

  mounted() {
  },

  methods: {
    handleCancel(){
      this.visible = false;
      this.reset();
    },
    isValidIP(ip) {
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      return ipRegex.test(ip);
    },

    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.isValidIP(this.form.blackIp)){
            this.$message({
              message: '请输入正确IP格式',
              type: "error"
            });
            return
          }
          if (this.type === 'add'){
            this.$http.post(this.$constant.baseURL + "/black/insert", this.form, true)
              .then((res) => {
                this.getBlackIp();
                this.visible = false
                this.reset()
                this.$message({
                  message: "操作成功！",
                  type: "success"
                });
              })
              .catch((error) => {
                this.$message({
                  message: error.message,
                  type: "error"
                });
              });
          }
          if (this.type === 'edit'){
            this.$http.post(this.$constant.baseURL + "/black/updateStopTime", this.form, true)
              .then((res) => {
                this.getBlackIp();
                this.visible = false
                this.reset()
                this.$message({
                  message: "操作成功！",
                  type: "success"
                });
              })
              .catch((error) => {
                this.$message({
                  message: error.message,
                  type: "error"
                });
              });
          }
        } else {
          this.$message({
            message: "请完善必填项！",
            type: "error"
          });
        }
      });
    },
    handleUpdateOrAdd(type, row){
      if (type === 'add'){
        this.title = '新增IP黑名单'
      }
      if (type === 'edit'){
        this.form.blackId = row.blackId
        this.form.blackIp = row.blackIp
        this.form.blackReason = row.blackReason
        this.form.stopTime = row.stopTime
        this.title = '修改IP黑名单'
        this.disable = true
      }
      this.type = type
      this.visible = true
    },

    reset(){
      this.form = {
        blackId: undefined,
        blackIp: undefined,
        blackReason: undefined,
        stopTime: undefined
      }
      this.disable = false
      this.type = ''
    },

    clearSearch() {
      this.pagination = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        blackIp: "",
        stopTime: undefined,
      }
      this.getBlackIp();
    },
    getBlackIp() {
      this.$http.get(this.$constant.baseURL + "/black/getAllWithPage", this.pagination, true)
        .then((res) => {
          if (!this.$common.isEmpty(res.code === 200)) {
            this.blackIps = res.rows;
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
      this.pagination.pageNum = val;
      this.getBlackIp();
    },
    searchBlackIp() {
      this.pagination.total = 0;
      this.pagination.pageNum = 1;
      this.getBlackIp();
    },

    handleDelete(item) {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true
      }).then(() => {
        this.$http.get(this.$constant.baseURL + "/black/delete", {blackId: item.blackId}, true)
          .then((res) => {
            this.pagination.current = 1;
            this.getBlackIp();
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
