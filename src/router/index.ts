import { createRouter, createWebHistory } from 'vue-router'
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
  history: createWebHistory(),
  routes,
  // ensure navigation scrolls to top of page
  scrollBehavior(to, from, savedPosition) {
    void to
    void from
    // if the user used browser back/forward, respect saved position
    if (savedPosition) {
      return savedPosition;
    }
    // always scroll to top for new navigation
    return { top: 0 };
  }
})

export default router
