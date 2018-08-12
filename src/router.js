import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
const Project = () => import(/* webpackChunkName: "project" */ './views/Project.vue');
const NewProject = () => import(/* webpackChunkName: "new-project" */ './views/NewProject.vue');
const EditProject = () => import(/* webpackChunkName: "edit-project" */ './views/EditProject.vue');
const ProjectPresentation = () => import(/* webpackChunkName: "project-presentation" */ './views/ProjectPresentation.vue');
const Presentation = () => import(/* webpackChunkName: "presentation" */ './views/Presentation.vue');
const Teams = () => import(/* webpackChunkName: "teams" */ './views/Teams.vue');

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/project/:id(\\d+)',
      name: 'project',
      component: Project
    },
    {
      path: '/project/edit/:id(\\d+)',
      name: 'edit-project',
      component: EditProject
    },
    {
      path: '/presentation',
      name: 'presentation',
      component: Presentation,
      meta: {
        hideNavigation: true
      }
    },
    {
      path: '/presentation/:id(\\d+)',
      name: 'project-presentation',
      component: ProjectPresentation,
      meta: {
        hideNavigation: true
      }
    },
    {
      path: '/newProject',
      name: 'new-project',
      component: NewProject
    },
    {
      path: '/teams',
      name: 'teams',
      component: Teams
    }
  ]
});
