<template>
    <div class="table" >
        <div class="crumbs" >
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 留言板管理</el-breadcrumb-item>
                <el-breadcrumb-item>留言板</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10 " @click="openDel">批量删除</el-button>
            <el-input  placeholder="输入提案主题搜索" class="handle-input mr10" v-model="skyword"></el-input>
            <el-button type="primary" icon="search"  @click="Search">搜索</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" @selection-change="changeFun"  >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="addTime" label="添加时间" sortable width="150"></el-table-column>
             <el-table-column  prop="user" label="用户" >
            </el-table-column>
            <el-table-column  prop="title" label="提案主题" >
            </el-table-column>
             <el-table-column  prop="content" label="提案内容" >
            </el-table-column>
            <el-table-column  label="图片" >
                 <template scope="scope">
                 
                </template>
            </el-table-column>
            
             <el-table-column prop="phone" label="联系方式" >
                  </el-table-column>
             <el-table-column prop="reply" label="管理员回复" >
                  </el-table-column>
              <el-table-column label="状态">
                   <template scope="scope">
                   <h5 v-if="scope.row.status===1">激活</h5>
                    <h5 v-else>未激活</h5>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope" >
                      <el-button size="small" type="primary"
                            @click="showPop(scope.row)">回复</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    @current-change ="handleCurrentChange"
                    layout="total,prev, pager, next"
                    :total="pagenum">
            </el-pagination>
        </div>
         <el-dialog title="回复" v-bind:visible.sync="dialogVisible">
        <el-form ref="form" :model="form" label-width="40px">
            <el-form-item>
                <el-input type="textarea" v-model="form.reply" placeholder="最多输入200个字符"  :maxlength="50"></el-input>
                <span class="tipreply">{{count}}/50</span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确认</el-button>
            </el-form-item>
        </el-form>
</el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
const ERR_OK=200
const url="http://localhost:63676/"
const SessionKey=localStorage.getItem('SessionKey')
    export default {
        data() {
            return {
               data:[],
               skyword:"",
               pageidex:0,
               pagenum:0,
               dialogVisible:false,
               form: { id:"", reply: "", },
               multipleSelection:[]
            }
        },
        created(){
            this.Search()
        },
        computed:{
              //计算content的值的长度
            count(){
                return this.form.reply.length
            }
        },
        methods: {  
            showPop(row){
              this.dialogVisible=true
              this.form.id=row.id
              this.form.reply=row.reply
            
            },            
            ///回复
            onSubmit(){
               axios({
                        method: 'post',
                        url: url+'/api/Console/SaveReply',
                        params:{
                             SessionKey:SessionKey,
                        },
                        data:{
                        id:this.form.id,
                        reply:this.form.reply,
                        skyword:this.skyword,
                        pageidex:this.pageidex,
                        },
                }).then(res=>{
                    console.log(res)
                            if (res.status === ERR_OK) { 
                                if(res.data.status==1){
                                 this.data=res.data.datas
                                 this.pagenum=res.data.msg
                                 this.$message.success("操作成功");
                                 this.dialogVisible=false
                                }
                               else 
                               console.log(res.data)
                                    this.$message.success(res.data.msg);
                            }
                        }).catch(function(err){
                            console.log(err)
                        })  
            },     
           Search(){   
                     axios.get(url+'/api/Console/GetMsgboardLst',{
                         params: {
                         SessionKey:SessionKey,
                         skyword:this.skyword,
                         pageidex:this.pageidex,
                     }
                     }).then(res=>{
                            if (res.status === ERR_OK) { 
                                console.log(res)
                              this.data=res.data.datas
                                 this.pagenum=res.data.msg
                            }
                        })             
           },
            //复选框状态改变
            changeFun(val) {
                console.log(val)
            this.multipleSelection=val
            },  
        openDel() {
             if(this.multipleSelection.length==0){
                this.$message.warning("请先选择数据");
                return
                }  
           this.$confirm('你确定删除数据吗, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                  this.handleEdit()
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
           handleEdit(){
              let datas=[]
                this.multipleSelection.forEach(row => {
                    datas.push({
                        id:row.id,
                        skyword:this.skyword,
                        pageidex:this.pageidex,
                    })
                });  
               axios({
                    method: 'post',
                    url: url+'/api/Console/editMsgboard',
                    data:datas,
                }).then(res=>{
                            if (res.status === ERR_OK) { 
                                if(res.data.status==1){
                                 this.data=res.data.datas
                                 this.pagenum=res.data.msg
                                 this.$message.success("操作成功");
                                }
                               else 
                               console.log(res.data)
                                    this.$message.success(res.data.msg);
                            }
                        }).catch(function(err){
                            console.log(err)
                        })  
           },
           handleCurrentChange(val){
                this.pageidex=val-1
                this.Search()
           }
        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
.icon{
   padding-top: 5px;
   width: 45px;
   height: 45px;

}
  .tipreply {
      margin-left: 95%;
        width: 26%;
        color: #b2b2b2;
  }
</style>