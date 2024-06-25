import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/Login'
import Register from '../views/register/Register'
import Home from '../views/home/Home'

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

Vue.use(VueRouter);

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  // {
  //   path: '/',
  //   redirect: '/login'
  // },
  {
    path: '/',
    component: () => import('../components/home'),
    children: [{
      path: "/",
      name: "index",
      component: () => import('../components/index')
    }, {
      path: "/sort",
      name: "sort",
      component: () => import('../components/sort')
    }, {
      path: "/article/:id",
      name: "article",
      component: () => import('../components/article')
    }, {
      path: "/favorite",
      name: "favorite",
      component: () => import('../components/favorite')
    }, {
      path: "/message",
      name: "message",
      component: () => import('../components/message')
    }, {
      path: "/user",
      name: "user",
      component: () => import('../components/user')
    }, {
      path: "/letter",
      name: "letter",
      component: () => import('../components/letter')
    }]
  },
];

const router = new VueRouter({
  mode: "history",
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0}
  }
})


export default router
