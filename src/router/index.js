import Vue from 'vue'
import Router from 'vue-router'
import DropBox from '@/components/DropBox'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
          path: '/',
          name: 'dropbox',
          component: DropBox
        }
    ]
})
