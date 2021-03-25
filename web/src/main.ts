import Vue from "vue";
import App from "@/App.vue";
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserEdit, faUserTie, faCoins, faEnvelopeOpenText, faUsers, faChild, faPaperPlane, faBook } from '@fortawesome/free-solid-svg-icons'
import VueRouter from "vue-router";
import VueCookies from "vue-cookies"
import routes from "@/routes";
import store from "@/store";
import http from "./plugins/http";
import "./filters";

import "@/styles/index.scss";
import "bootstrap-vue/dist/bootstrap-vue.css";

// https://www.npmjs.com/package/vue-fontawesome-icon
// import material-icon scss
import "font-awesome/css/font-awesome.min.css";
import { SessionManager } from "@/components/utils/utils";

library.add(faUserTie);
library.add(faUserEdit);
library.add(faCoins);
library.add(faEnvelopeOpenText);
library.add(faUsers);
library.add(faChild);
library.add(faPaperPlane);
library.add(faBook)

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueRouter);
Vue.use(VueCookies);
Vue.use(http);
Vue.component('font-awesome-icon', FontAwesomeIcon);

const router = new VueRouter({
    routes: routes, 
    mode: "history", 
    base: process.env.BASE_URL,
    scrollBehavior(to, from, savedPosotion) { 
        return { x: 0, y: 0 }
    }
});

// Redirect to /family-law-act/
history.pushState({page: "home"}, "", process.env.BASE_URL)

SessionManager.redirectIfQuickExitCookie();

new Vue({
    router: router,
    render: (h) => h(App),
    store: store,
    data: {},
}).$mount("#app");
