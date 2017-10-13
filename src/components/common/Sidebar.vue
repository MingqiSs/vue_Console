<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                   
                    {
                        icon: 'el-icon-menu',
                        index: '1',
                        title: '项目管理',
                        subs: [
                            {
                                index: 'pjManage',
                                title: '项目总览'
                            },
                            {
                                index: 'PjTypeManag',
                                title: '项目总览类型'
                            }
                        ]
                    },
                      {
                        icon: 'el-icon-menu',
                        index: '2',
                        title: '留言板管理',
                        subs: [
                            {
                                index: 'Msgboard',
                                title: '留言板'
                            },
                        ]
                    },
                     {
                        icon: 'el-icon-menu',
                        index: '3',
                        title: '问卷调查管理',
                        subs: [
                            {
                                index: '12312',
                                title: '问卷调查'
                            },
                        ]
                    },
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
