import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import store from '../store';
import RegisterViewVue from '../views/register-view/index.vue';
import LoginView from '../views/login-page-view/index.vue';
import ForgotPasswordFormView from '../views/forgot-password-view/index.vue';

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
    component: ForgotPasswordFormView,
  },
];

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  document.title = to.meta?.pageTitle ?? '';

   await store.dispatch("handleUserAuthentication")

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
