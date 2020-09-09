import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/mapbox'
  },
  {
    path: '/mapbox',
    component: resolve => require(['../components/Mapbox.vue'], resolve)
  }, {
    path: '/test',
    component: resolve => require(['../components/test.vue'], resolve)
  },
  {
    path: '/403',
    component: resolve => require(['../components/403.vue'], resolve),
  },
  {
    path: '/404',
    component: resolve => require(['../components/404.vue'], resolve),
  },
  {
    path: '/airportmeteo',
    component: resolve => require(['../components/airportMeteo.vue'], resolve),
  }, {
    path: '/satellite',
    component: resolve => require(['../components/Satellite.vue'], resolve)
  },
  {
    path: '*',
    redirect: '/404'
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router