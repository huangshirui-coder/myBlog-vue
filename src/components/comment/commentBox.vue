<template>
  <div>
    <!-- 框 -->
    <textarea
      class="comment-textarea"
      v-model="content"
      placeholder="写下点什么..."
      maxlength="1000"/>
    <!-- 按钮 -->
    <div class="myBetween" style="margin-bottom: 10px">
      <div style="display: flex">
        <div :class="{'emoji-active':showEmoji}"
             @click="showEmoji = !showEmoji">
          <i class="el-icon-orange myEmoji"></i>
        </div>
      </div>

      <div style="display: flex">
<!--        <proButton :info="'涂鸦'"-->
<!--                   v-show="!$common.mobile() && !disableGraffiti"-->
<!--                   @click.native="showGraffiti()"-->
<!--                   :before="$constant.before_color_1"-->
<!--                   :after="$constant.after_color_1"-->
<!--                   style="margin-right: 6px">-->
<!--        </proButton>-->
        <proButton :info="'提交'"
                   @click.native="submitComment()"
                   :before="$constant.before_color_2"
                   :after="$constant.after_color_2">
        </proButton>
      </div>
    </div>
    <!-- 表情 -->
    <emoji @addEmoji="addEmoji" :showEmoji="showEmoji"></emoji>

  </div>
</template>

<script>
  const emoji = () => import( "../common/emoji");
  const proButton = () => import( "../common/proButton");

  export default {
    components: {
      emoji,
      proButton,
    },
    props: {
      disableGraffiti: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        content: "",
        showEmoji: false,
        showPicture: false,
        picture: {
          name: this.$store.state.currentUser.username,
          url: ""
        }
      };
    },
    methods: {


      addEmoji(key) {
        this.content += key;
      },

      submitComment() {
        if (this.$common.isEmpty(this.$store.state.currentUser) && false) {
          this.$message({
            message: "请先登录！",
            type: "error"
          });
          return;
        }

        if (this.content.trim() === "") {
          this.$message({
            message: "你还没写呢~",
            type: "warning"
          });
          return;
        }
        this.$emit("submit", this.content.trim());
        this.content = "";
      }
    }
  }
</script>

<style scoped>
  .comment-textarea {
    border: 1px solid var(--lightGray);
    width: 100%;
    font-size: 14px;
    padding: 15px;
    min-height: 180px;
    /* 不改变大小 */
    resize: none;
    /* 不改变边框 */
    outline: none;
    border-radius: 4px;
    background-image: var();
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 100%;
    margin-bottom: 10px;
  }

  .comment-textarea:focus {
    border-color: var(--themeBackground);
  }

  .myEmoji {
    font-size: 18px;
    cursor: pointer;
    transition: all 0.5s;
    margin-right: 12px;
  }

  .myEmoji:hover {
    transform: rotate(360deg);
    font-size: 22px;
  }

  .myPicture {
    font-size: 18px;
    cursor: pointer;
  }

  .emoji-active {
    color: var(--red);
  }
</style>
