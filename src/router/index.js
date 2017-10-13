import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            
            path: '/pjManage',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/pjManage.vue'], resolve)
                },
                {
                    path: '/pjManage',
                    component: resolve => require(['../components/page/pjManage.vue'], resolve)
                },
                {
                    path: '/PjTypeManag',
                    component: resolve => require(['../components/page/PjTypeManag.vue'], resolve)
                },
                {
                    path: '/Msgboard',
                    component: resolve => require(['../components/page/Msgboard.vue'], resolve)
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
