<template>
  <div>
    <div class="panel panel-flat">
      <div class="panel-heading">
        <h5 class="panel-title">房间类型信息</h5>
      </div>
      <div class="dataTables_filter">
        <span>床铺类型筛选:</span>
        <el-select v-model="types" placeholder="根据什么查询">
          <el-option label="床铺编号" value="001"></el-option>
          <el-option label="床铺名称" value="002"></el-option>
          <el-option label="全部" value=""></el-option>
        </el-select>
        <input type="text" placeholder="对应值" v-model="value">
        <a href="javascript:;" class="btn btn-info" @click="search">搜索</a>
      </div>
      <table class="table datatable-show-all">
        <thead>
        <tr>
          <th>床铺编号</th>
          <th>床铺类型名称</th>
          <th>床铺类型简介</th>
          <th class="text-center">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in BedTypeListKeyword">
          <td>{{item.bt_BedTypeID}}</td>
          <td>{{item.bt_BedTypeName}}</td>
          <td>{{item.bt_Remark}}</td>
          <td class="text-center">
            <ul class="icons-list">
              <li class="dropdown">
                <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                  <i class="icon-menu9"></i>
                </a>

                <ul class="dropdown-menu dropdown-menu-right">
                  <li><a href="javascript:;" @click="addBedType"><i class="icon-add"></i>添加 </a></li>
                  <li><a href="javascript:;" @click="updateBedType(item.bt_BedTypeID)"><i class="icon-pencil"></i> 修改</a></li>
                  <li><a href="javascript:;" @click="deleteBedType(item.bt_BedTypeID)"><i class="icon-delicious"></i> 删除</a></li>
                </ul>
              </li>
            </ul>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <!--添加床铺类型-->
    <el-dialog title="添加床铺类型" :visible.sync="addBedTypeDialog">
      <el-form :model="AddBedType">
        <el-form-item label="类型名称" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="AddBedType.BedTypeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="AddBedType.Remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBedTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="addBedTypeSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改床铺类型-->
    <el-dialog title="修改床铺类型" :visible.sync="updateBedTypeDialog">
      <el-form :model="initUpdateBedType">
        <el-form-item label="类型编号" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="initUpdateBedType.bt_BedTypeID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型名称" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="initUpdateBedType.bt_BedTypeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="initUpdateBedType.bt_Remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateBedTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateBedTypeSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {POST,IsBackCode} from '../assets/js/public'
  export default{
    name: '',
    data(){
      return {
        types:'',
        value:'',//初始化搜索
        addBedTypeDialog:false,//添加弹窗
        updateBedTypeDialog:false,//修改弹窗
        formLabelWidth:'120px',
        isOff:true,
        AddBedType:{
          BedTypeName:'',
          Remark:''
        }
      }
    },
    computed:mapGetters([
      'BedTypeListKeyword',
      'initUpdateBedType'
    ]),
    methods:{
      //初始化数据
      initData(){
        POST('http://114.55.248.116:3333/HotelService.asmx/GetBedTypeList',{
          condition:this.types,
          key:this.value
        },data=>{
          var data = JSON.parse(data);
          IsBackCode(data,this)
          if(data.backCode==200){
            this.$store.commit('initBedTypeList',data.ht_BedType)
          }
        })
      },
      //筛选
      search(){
        this.initData();
      },
      //添加
      addBedType(){
        this.addBedTypeDialog = true;
        this.$store.commit('setTranstionFalse')
      },
      //添加提交
      addBedTypeSubmit(){
        if(this.AddBedType.BedTypeName.trim()==''){
          this.$message({
            showClose: true,
            message: '房间名称不能为空！',
            type: 'error'
          });
          return;
        }
        POST('http://114.55.248.116:3333/HotelService.asmx/AddBedType',this.AddBedType
        ,data=>{
            var data = JSON.parse(data);
            IsBackCode(data,this);
            if(data.backCode=='200'){
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              });
              this.initData();
            }
            this.addBedTypeDialog = false;
          })
      },
      //初始化修改
      updateBedType(id){
        this.updateBedTypeDialog = true;
        this.$store.commit('setTranstionFalse');
        this.$store.commit('initUpdateBedType',id);
      },
      //修改
      updateBedTypeSubmit(){
        POST('http://114.55.248.116:3333/HotelService.asmx/UpdateBedType',{
          BedTypeID:this.initUpdateBedType.bt_BedTypeID,
          BedTypeName:this.initUpdateBedType.bt_BedTypeName,
          Remark:this.initUpdateBedType.bt_Remark
        },data=>{
          var data = JSON.parse(data);
          IsBackCode(data,this);
          if(data.backCode=='200'){
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            });
          }
          this.updateBedTypeDialog = false
        })
      },
      //删除
      deleteBedType(id){
        POST('http://114.55.248.116:3333/HotelService.asmx/DeleteBedType',{
          BedTypeID:id
        },data=>{
          var data = JSON.parse(data);
          IsBackCode(data,this);
          if(data.backCode=='200') {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.$store.commit('filterBedType',id);
          }else{
            this.$message({
              showClose: true,
              message: data.backCode.backResult,
              type: 'error'
            });
            return;
          }
        })
      }
    }
  }
</script>
<style scoped>

</style>
