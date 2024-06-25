<template>
  <div class="background">
    <el-card class="box-card">
      <h2>登录</h2>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="70px"
        class="login-from"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btnGroup">
        <el-button type="primary" @click="submitForm('ruleForm')" v-loading="loading">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <router-link to="/register">
          <el-button style="margin-left:10px">注册</el-button>
        </router-link>
      </div>
    </el-card>
  </div>


</template>

<script>
  export default {
    data() {
      return {
        ruleForm: {
          userName: "",
          password: "",
        },
        loading: false,
        rules: {
          userName: [
            { required: true, message: "用户名不能为空！", trigger: "blur" },
          ],
          password: [
            { required: true, message: "密码不能为空！", trigger: "blur" },
          ],
        },
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          // 如果经过校验，账号密码都不为空，则发送请求到后端登录接口
          if (valid) {
            this.loading = true;
            let _this = this;
            this.$http.post(
              "http://localhost:8088/userLogin/login",               // 请求地址
              {                             // 请求参数
                userName: _this.ruleForm.userName,
                password: _this.ruleForm.password,
              },
            ).then((res) => { // 当收到后端的响应时执行该括号内的代码，res 为响应信息，也就是后端返回的信息
              if (!this.$common.isEmpty(res.data)) {  // 当响应的编码为 200 时，说明登录成功
                // 将用户信息存储到sessionStorage中
                sessionStorage.setItem("userInfo", JSON.stringify(res.data.data));
                // 跳转页面到首页
                this.$router.push({path: '/'});
                // 显示后端响应的成功信息
                this.$message({
                  message: res.data.msg,
                  type: "success",
                });
                console.log("success");
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
    },
  };
</script>

<style scoped>
  .background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(../../../public/picture/background.jpg) no-repeat;
    background-size:100% 100%;
  }
  .box-card {
    margin: 100px auto;
    width: 500px;
    height: 400px;
    background: rgba(255,255,255,0.7);
    border: none; /* this removes the border */
    box-shadow: none;  /* this removes the box shadow, which also might be seen as a "border" */
  }
  .login-from {
    margin: 50px auto;
    width: 400px;
  }


</style>
