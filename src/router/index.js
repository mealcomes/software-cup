import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Editor from "@/views/Editor.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/editor',
        name: 'Editor',
        component: Editor
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})