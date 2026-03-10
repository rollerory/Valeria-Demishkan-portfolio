import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Timeline from '../pages/Comercial.vue'
import About from '../pages/Trainee.vue'
import Project from '../pages/Project.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/comercial',
    name: 'Comercial',
    component: Timeline
  },
  {
    path: '/trainee',
    name: 'Trainee',
    component: About
  },
  {
    path: '/projects/:slug',
    name: 'Project',
    component: Project,
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return { top: 0 }
  }
})

export default router