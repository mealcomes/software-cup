import {createRouter, createWebHashHistory} from "vue-router";
import Home from "@/views/Home.vue";
import Editor from "@/views/Editor.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        redirect: '/recent',
        children: [
            {
                path: '/recent',
                name: 'recent',
                component: () => import('../components/home/Recent.vue')
            },
            {
                path: '/star',
                name: 'star',
                component: () => import('../components/home/Star.vue')
            },
            {
                path: '/deleted',
                name: 'deleted',
                component: () => import('../components/home/Deleted.vue')
            },
        ]
    },
    {
        path: '/editor',
        name: 'Editor',
        component: Editor
    },
    {
        path: '/mdeditor',
        name: 'MdEditor',
        component: () => import('../components/tiptap/MarkdownEditor.vue')
    }, 
    {
        path: '/mdppt',
        name: 'Mdppt',
        component: () => import('../components/tiptap/RevealPPT.vue')
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})