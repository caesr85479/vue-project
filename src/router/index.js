import Vue from 'vue'
import Router from 'vue-router'

import admin from '@/components/admin'
import home from '@/components/pages/home'
import news from '@/components/pages/news'
import station from '@/components/pages/station'
import time from '@/components/pages/time'
import fare from '@/components/pages/fare'
import map from '@/components/pages/map'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'admin',
      component: admin,
      children: [
        {
          path: '',
          name: 'home',
          component: home,
        },
        {
          path: '/news',
          name: 'news',
          component: news
        },
        {
          path: '/station',
          name: 'station',
          component: station
        },
        {
          path: '/time',
          name: 'time',
          component: time
        },
        {
          path: '/fare',
          name: 'fare',
          component: fare
        },
        {
          path: '/map',
          name: 'map',
          component: map
        }
      ]
    }
  ]
})
