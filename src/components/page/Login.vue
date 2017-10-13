<template>
    <div class="login-wrap">
        <div class="ms-title">艺文汇后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="userName">
                    <el-input v-model="ruleForm.userName" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <!-- <p style="font-size:12px;line-height:30px;color:#999;">Tips : 请输入正确的账号密码。</p> -->
            </el-form>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
const ERR_OK=200
    export default {
        data: function(){
            return {
                ruleForm: {
                    userName: '',
                    password: ''
                },
                rules: {
                    userName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                         axios.post("http://localhost:63676/api/Account/login",this.ruleForm).then(res=>{
                            if (res.status === ERR_OK) {
                                console.log(res)
                                if(res.data.status===1)
                                {                                  
                                   localStorage.setItem('SessionKey',res.data.datas);
                                   localStorage.setItem('userName',this.ruleForm.userName);
                                 //  window.cookie="SessionKey"+'='+res.data.datas
                                    self.$router.push('/pjManage');
                                } 
                                else
                                {
                                      this.$message.error("账号或者密码错误");
                                }
                            }
                        })
                        // if(this.ruleForm.userName=="admin"&&this.ruleForm.password=="12345")
                        //  {
                        //   localStorage.setItem('LoginUser',"admin");
                        //  self.$router.push('/pjManage');
                        //  }
                        //  else
                        //   this.$message.error("登陆失败");
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>