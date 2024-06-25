<template>
  <div>
    <el-card class="box-card">
      <h2>注册</h2>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="ruleForm.sex"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
      </el-form>
      <div class="btnGroup">
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          if (this.ruleForm.checkPass !== "") {
            this.$refs.ruleForm.validateField("checkPass");
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      var checkPhone = (rule, value, callback) => {
        const phoneReg = /^1[34578]\d{9}$$/;
        if (!value) {
          return callback(new Error('电话号码不能为空'))
        }
        setTimeout(() => {
          // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
          // 所以在前面加了一个+实现隐式转换

          if (!Number.isInteger(+value)) {
            callback(new Error('请输入数字值'))
          } else {
            if (phoneReg.test(value)) {
              callback()
            } else {
              callback(new Error('电话号码格式不正确'))
            }
          }
        }, 100)
      };
      var checkEmail = (rule, value, callback) => {
        const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if (!value) {
          return callback(new Error('邮箱不能为空'))
        }
        setTimeout(() => {
          if (mailReg.test(value)) {
            callback()
          } else {
            callback(new Error('请输入正确的邮箱格式'))
          }
        }, 100)
      };
      return {
        ruleForm: {
          userName: "",
          pass: "",
          password: "",
          nickname: "",
          sex: "",
          phone: "",
          email: ""
        },
        rules: {
          userName: [{ required: true, message: "用户名不能为空！", trigger: "blur" }],
          pass: [{ required: true, validator: validatePass, trigger: "blur" }],
          password: [{ required: true, validator: validatePass2, trigger: "blur" }],
          email: [{required: true, validator: checkEmail, trigger: "blur"}],
          phone: [{required: true, validator: checkPhone, trigger: "blur"}],
          sex: [{ required: true, message: "性别不能为空！", trigger: "blur" }],
        },
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            let _this = this;
            this.$http.post(
              "http://localhost:8088/user/register",               // 请求地址
              {                             // 请求参数
                userName: _this.ruleForm.userName,
                password: _this.ruleForm.password,
                nickname: _this.ruleForm.nickname,
                sex: _this.ruleForm.sex,
                phone: _this.ruleForm.phone,
                email: _this.ruleForm.email
              }
            ).then((res) => { // 当收到后端的响应时执行该括号内的代码，res 为响应信息，也就是后端返回的信息
              if (!this.$common.isEmpty(res.data)) {
                // 注册成功跳转登陆页面
                this.$router.push('/login');
                // 显示后端响应的成功信息
                this.$message({
                  message: res.data.msg,
                  type: "success",
                });
              } else {  // 当响应的编码不为 200 时，说明登录失败
                // 显示后端响应的失败信息
                this.$message({
                  message: res.data.msg,
                  type: "warning",
                });
              }
              // 不管响应成功还是失败，收到后端响应的消息后就不再让登录按钮显示加载动画了
              _this.loading = false;
              console.log(res);
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      goBack() {
        this.$router.go(-1);
      },
    },
  };
</script>

<style scoped>
  .box-card {
    margin: auto auto;
    width: 400px;
  }
  .login-from {
    margin: auto auto;
  }
</style>
