<template >
    <div class="table" >
        <div class="crumbs" >
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 项目管理</el-breadcrumb-item>
                <el-breadcrumb-item>项目总览类型</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="insert" class="handle-del mr10" @click="insertType">新增</el-button>
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="openDel" >批量删除</el-button>
            <el-input  placeholder="输入类型名称搜索" class="handle-input mr10" v-model="skyword"></el-input>
            <el-button type="primary" icon="search"  @click="Search()">搜索</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" :row-class-name="tableRowClassName" @selection-change="changeFun" ref="multipleTable">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="date" label="添加日期" sortable width="150">
            </el-table-column>
            <el-table-column prop="Name" label="类型名称">
            </el-table-column>
              <el-table-column label="状态">
                  <template scope="scope">
                   <h5 v-if="scope.row.status===1">激活</h5>
                    <h5 v-else>未激活</h5>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                              <el-button size="small" type="primary" 
                            @click="handleDelete(1, scope.row)" v-show="scope.row.status===0">激活</el-button>
                             <el-button size="small" 
                            @click="handleDelete(0, scope.row)" v-show="scope.row.status===1">冻结</el-button>
                           
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
           <el-dialog
    title="新增/编辑类型"
    :visible.sync="dialogVisible"
    size="tiny"
    >
    <el-form ref="form" :model="form" label-width="80px">
  <el-form-item label="类型名称">
    <el-input v-model="form.Name"></el-input>
  </el-form-item>
  <el-form-item label="排序号">
    <el-input v-model="form.sort"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">确定</el-button>
    <el-button @click="dialogVisible=false">取消</el-button>
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
               form:{},
               multipleSelection:[]
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
            openDel(){       
              if(this.multipleSelection.length==0){
                    this.$message.warning("请先选择数据");
                    return
                    }  
            this.$confirm('你确定删除数据吗, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                    this.handleDelete(2,)
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            //复选框状态改变
            changeFun(val) {
            this.multipleSelection=val
            },        
           Search(){    
                     axios.get(url+"/api/Console/GetPjTypeLst",{
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
                        }).catch(function(){
                            console.log("err")
                        })            
           },
           handleDelete(status, row){
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
                    url: url+'/api/Console/DeletePjType',
                    params:{
                         SessionKey:SessionKey,
                    },
                    data:datas,
                    // headers: {
                    //     'Content-Type': 'application/x-www-form-urlencoded'
                    // }
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
           insertType(){
               this.form={id:-1,Name:""}
             this.dialogVisible=true
           },
           //编辑
           handleEdit(index, row){
            //  this.$router.push({path: '/BaseForm',query: {actid:this.data[index].Id}})
            this.form=row;
            this.dialogVisible=true
           },
           //新增or编辑
           onSubmit(){
             axios({
                    method: 'post',
                    url: url+'/api/Console/EditType',
                    params:{
                         SessionKey:SessionKey,
                    },
                    data:{
                    id:this.form.id,
                    Name:this.form.Name,
                    skyword:this.skyword,
                    pageidex:this.pageidex,
                     },
                }).then(res=>{
                            if (res.status === ERR_OK) { 
                                if(res.data.status==1){
                                 this.data=res.data.datas
                                 this.pagenum=res.data.msg
                                 this.$message.success("保存成功");
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
           handleCurrentChange(val){
                //   console.log(`当前页: ${val}`);
                this.pageidex=val-1              
                this.Search()
           }
        }
    }
</script>
<style >
.el-table .info-row{
color: rgb(204, 204, 204);
}
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
   width: 50px;
   height: 50px;
}
</style>