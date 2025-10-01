<template>
    <SideBar />
    <router-view></router-view>
</template>

<script>
import SideBar from '../views/SideBar/SideBar.vue';

export default {
    name: 'MainLayout',
    components: {
        SideBar,
    },

    data() {
        return {

        }
    }
}
</script>