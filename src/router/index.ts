import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import Cookie from "js-cookie"
import store from '../store';
import { jwtDecode } from "jwt-decode";
import RegisterViewVue from '../views/RegisterView.vue';
import ForgotPasswordVIewVue from '../views/ForgotPasswordVIew.vue';


Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'root',
    redirect: "/home"
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      pageTitle: 'VueApp - Home',
      needAuth: true
    },
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      pageTitle: 'VueApp - Login',
      needAuth: false
    },
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      pageTitle: 'VueApp - Register',
      needAuth: false
    },
    component: RegisterViewVue,
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    meta: {
      pageTitle: 'VueApp - Forgot Password',
      needAuth: false
    },
    component: ForgotPasswordVIewVue,
  },
];

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta?.pageTitle ?? '';

  store.dispatch("handleUserAuthentication")

  const isRequesterAuthenticated = store.getters.userMetadata.isAuthenticated;

  if(to.path === "/login" && isRequesterAuthenticated){
    next("/home")
  }

  if(to.meta?.needAuth && !isRequesterAuthenticated){
    next("/login")
  }

  next()
});

export default router;
