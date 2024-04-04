import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    meta: {
      pageTitle: 'Home',
    },
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      pageTitle: 'Login',
    },
    component: LoginView,
  },
];

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta?.pageTitle ?? '';
  next();
});

export default router;
