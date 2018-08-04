import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Project from './views/Project.vue';
import NewProject from './views/NewProject.vue';
import EditProject from './views/EditProject.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/project/:id',
      name: 'project',
      component: Project
    },
    {
      path: '/project/edit/:id',
      name: 'edit-project',
      component: EditProject
    },
    {
      path: '/newProject',
      name: 'new-project',
      component: NewProject
    }
  ]
});
