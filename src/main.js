// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import glo from './global.js';
import { Icon, Field, Toast, Actionsheet, PullRefresh, List, Popup, Button, Dialog } from 'vant';

console.log(glo);
Vue.config.productionTip = false;
import 'lib-flexible/flexible.js';

Vue.prototype.unit = "PAD";

Vue.use(Icon);
Vue.use(Field);
Vue.use(Toast);
Vue.use(Actionsheet);
Vue.use(PullRefresh);
Vue.use(List);
Vue.use(Popup);
Vue.use(Button);
Vue.use(Dialog);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
});