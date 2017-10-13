<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 活动管理</el-breadcrumb-item>
                <el-breadcrumb-item>活动编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="活动主题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                form: {
                    title: '',
                },
            }
        },
        methods: {
            onSubmit() {
                this.$message.success('提交成功！');
            }
        }
    }
</script>