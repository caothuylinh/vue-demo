// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import vueResource from 'vue-resource'
import Repo from './components/Repo'

Vue.use(vueResource)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {path: '/', component: Repo},
    {path: '/repo', component: Repo}
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: `
    <div id="app">
      <h1>Repository Demo</h1>
        <nav class="navbar navbar-default">
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li><router-link to="/repo">My Repo </router-link></li>
            <li>Link</li>
          </ul>
        </div>
       </nav>
      <router-view></router-view>
    </div>
`,
  components: { App }
}).$mount('#app')
