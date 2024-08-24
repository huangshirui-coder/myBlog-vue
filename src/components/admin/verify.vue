<template>
  <div class="myCenter verify-container">
    <!-- 背景图片 -->
    <el-image class="my-el-image"
              style="position: absolute"
              v-once
              lazy
              :src="$common.isEmpty(this.$store.state.webInfo.adminLoginCover) ? 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg' : this.$store.state.webInfo.adminLoginCover"
              fit="cover">
      <div slot="error" class="image-slot"></div>
    </el-image>
    <div class="verify-content">
      <div>
        <el-avatar :size="50" :src="$store.state.webInfo.webHead"></el-avatar>
      </div>
      <div>
        <el-input v-model="account">
          <template slot="prepend">账号</template>
        </el-input>
      </div>
      <div>
        <el-input v-model="password" type="password">
          <template slot="prepend">密码</template>
        </el-input>
      </div>
      <div>
        <proButton :info="'提交'"
                   @click.native="login()"
                   :before="$constant.before_color_2"
                   :after="$constant.after_color_2">
        </proButton>
      </div>
    </div>
  </div>
</template>

<script>
  const proButton = () => import( "../common/proButton");

  export default {
    components: {
      proButton
    },
    data() {
      return {
        redirect: this.$route.query.redirect,
        account: "",
        password: ""
      }
    },
    computed: {},
    created() {

    },
    methods: {
      login() {
        if (this.$common.isEmpty(this.account) || this.$common.isEmpty(this.password)) {
          this.$message({
            message: "请输入账号或密码！",
            type: "error"
          });
          return;
        }

        let user = {
          userName: this.account.trim(),
          password: this.password.trim(),
        };

        this.$http.post(this.$constant.baseURL + "/userLogin/login", user, true)
          .then((res) => {
            if (!this.$common.isEmpty(res.data.user) && res.data.user.role === "admin") {
              localStorage.setItem("adminToken", res.data.token);
              this.$store.commit("loadCurrentAdmin", res.data.user);
              this.account = "";
              this.password = "";
              this.$router.push({path: this.redirect});
            }else{
              this.$message({
                message: "您无登录权限，请与管理员联系!",
                type: "error"
              });
            }
          })
          .catch((error) => {
            this.$message({
              message: "登录失败，请检查用户名或密码！",
              type: "error"
            });
          });
      }
    }
  }
</script>

<style scoped>

  .verify-container {
    height: 100vh;
    background: var() center center / cover repeat;
  }

  .verify-content {
    background: var(--maxWhiteMask);
    padding: 30px 40px 5px;
    position: relative;
  }

  .verify-content > div:first-child {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: -25px;
  }

  .verify-content > div:not(:first-child) {
    margin: 25px 0;
  }

  .verify-content > div:last-child > div {
    margin: 0 auto;
  }

</style>
