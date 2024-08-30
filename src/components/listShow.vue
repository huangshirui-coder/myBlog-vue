<template>
  <div>
    <!-- 两句诗 -->
    <div class="my-animation-slide-top">
      <twoPoem></twoPoem>
    </div>
    <div style="background: var(--background);padding-top: 80px;" class="my-animation-slide-bottom">
      <!-- 文章 -->
      <div class="article-wrap">
        <articleList :articleList="articles"></articleList>
        <div class="pagination-wrap">
          <div @click="pageArticles()" class="pagination" v-if="pagination.total !== articles.length">
            下一页
          </div>
          <div v-else style="user-select: none">
            ~~到底啦~~
          </div>
        </div>
      </div>
      <!-- 页脚 -->
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";

const twoPoem = () => import("./common/twoPoem.vue");
const articleList = () => import( "./articleList");
const myFooter = () => import( "./common/myFooter");

export default {
  components: {
    twoPoem,
    articleList,
    myFooter
  },

  data() {
    return {
      articles: [],
      type: this.$route.query.type,
      pagination:{
        pageNum: 1,
        pageSize: 10,
        total: 0,
        userUid: this.$store.state.currentUser.id
      },
    }
  },
  created() {
    if (this.type === 'like'){
      this.getLikeBlog()
    }
    if (this.type === 'record'){
      this.getRecordBlog()
    }
  },
  methods:{
    pageArticles(){
      this.pagination.pageNum = this.pagination.pageNum + 1;
      if (this.type === 'like'){
        this.getLikeBlog()
      }
      if (this.type === 'record'){
        this.getRecordBlog()
      }
    },
    getLikeBlog(){
      this.$http.get(this.$constant.baseURL + "/blog/getLikeBlogByUser", this.pagination)
        .then(res => {
          if (!this.$common.isEmpty(res.rows)) {
            res.rows.forEach(item => {
              const md = new MarkdownIt({breaks: true}).use(require('markdown-it-multimd-table'));
              item.content = md.render(item.content);
            })
            this.articles = this.articles.concat(res.rows);
            this.pagination.total = res.total;
          }
        })
    },
    getRecordBlog(){
      this.$http.get(this.$constant.baseURL + "/blog/getRecordBlogByUser", this.pagination)
        .then(res => {
          if (!this.$common.isEmpty(res.rows)) {
            res.rows.forEach(item => {
              const md = new MarkdownIt({breaks: true}).use(require('markdown-it-multimd-table'));
              item.content = md.render(item.content);
            })
            this.articles = this.articles.concat(res.rows);
            this.pagination.total = res.total;
          }
        })
    },
  }
}
</script>

<style scoped>
  .sort-warp {
    width: 70%;
    max-width: 780px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
  }

  .article-wrap {
    width: 70%;
    margin: 40px auto;
    min-height: 600px;
  }

  .isActive {
    animation: scale 1.5s ease-in-out infinite;
  }

  .pagination-wrap {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }

  .pagination {
    padding: 13px 15px;
    border: 1px solid var(--lightGray);
    border-radius: 3rem;
    color: var(--greyFont);
    width: 100px;
    user-select: none;
    cursor: pointer;
    text-align: center;
  }

  .pagination:hover {
    border: 1px solid var(--themeBackground);
    color: var(--themeBackground);
    box-shadow: 0 0 5px var(--themeBackground);
  }


  @media screen and (max-width: 900px) {
    .sort-warp {
      width: 90%;
    }

    .article-wrap {
      width: 90%;
    }
  }
</style>
