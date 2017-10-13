<template>
    <div class="table" >
        <div class="crumbs" >
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 项目管理</el-breadcrumb-item>
                <el-breadcrumb-item>项目总览</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10 " @click="openDel">批量删除</el-button>
            <el-input  placeholder="输入项目名称搜索" class="handle-input mr10" v-model="skyword"></el-input>
            <el-button type="primary" icon="search"  @click="Search">搜索</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" :row-class-name="tableRowClassName" @selection-change="changeFun">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="addTime" label="添加时间" sortable width="150"></el-table-column>
            <el-table-column  label="项目名称" >
             <template scope="scope">
                <el-popover trigger="hover" placement="top">
                <p>项目名称: {{ scope.row.title }}</p>
                <p>主办方: {{ scope.row.organizers}}</p>
                 <p>协办方: {{ scope.row.co_organizer}}</p>
                  <p>承办方: {{ scope.row.undertake}}</p>
                   <p>联系人: {{ scope.row.contacts  }}</p>
                   <p>联系电话: {{ scope.row.phone  }}</p>
                  <p>项目简介: {{ scope.row.intro  }}</p>
                  <p>开始时间至结束时间: {{ scope.row.startTime}}-{{ scope.row.endTime}}</p>
                <div slot="reference" class="name-wrapper">
                    <el-tag>{{ scope.row.title }}</el-tag>
                </div>
                </el-popover>
            </template>
            </el-table-column>
            <el-table-column  label="封面图片" >
                 <template scope="scope">
                   <img :src="scope.row.imgurl" class="icon" />
                </template>
            </el-table-column>
            <el-table-column prop="companyName" label="上传者" >
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
                            @click="handleEdit(1, scope.row)" v-show="scope.row.status===0">激活</el-button>
                       <el-button size="small" 
                            @click="handleEdit(0, scope.row)" v-show="scope.row.status===1">冻结</el-button> 
                         <div style="  margin-top: 10px">
                                  <el-button size="small"
                            @click="handleDelete(scope.$index, scope.row)">活动管理</el-button>  
                             <el-button size="small"
                            @click="handleDelete(scope.$index, scope.row)">评论管理</el-button>       
                            </div>            
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
               multipleSelection:[],
            }
        },
        created(){
            this.Search()
        },
        methods: { 
              tableRowClassName(row, index) {
                if (row.status ===0) {
                 return 'info-row';
                }
                return '';
            },           
           Search(){   
                     axios.get(url+'/api/Console/GetPjLst',{
                         params: {
                         SessionKey:SessionKey,
                         skyword:this.skyword,
                         pageidex:this.pageidex,
                     }
                     }).then(res=>{
                            if (res.status === ERR_OK) { 
                              this.data=res.data.datas
                                 this.pagenum=res.data.msg
                            }
                        }).catch(error=>{
                        //   this.$router.push('/login');
                        })             
           },
              //复选框状态改变
            changeFun(val) {
            this.multipleSelection=val
            },  
           //删除确认
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
                   this.handleEdit(2,)
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
           handleEdit(status, row){
              let datas=[]
              //删除
               if(status===2){
                this.multipleSelection.forEach(row => {
                    datas.push({
                        id:row.id,
                         status:2,
                        skyword:this.skyword,
                        pageidex:this.pageidex,
                    })
                });   
               }
                 //激活或者冻结
               else{
                   datas.push({
                    id:row.id,
                    status:status,
                    skyword:this.skyword,
                    pageidex:this.pageidex,
                   })
               }
               axios({
                    method: 'post',
                    url: url+'/api/Console/EditPj',
                     params: {SessionKey:SessionKey},
                    data:datas
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

<style >
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
.el-table .info-row{
color: rgb(204, 204, 204);
}
</style>