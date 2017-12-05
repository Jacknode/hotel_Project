<template>
  <div>
    <div class="panel panel-flat">
      <div class="panel-heading">
        <h5 class="panel-title">房间类型信息</h5>
      </div>
      <div class="dataTables_filter">
        <span>房间类型筛选:</span>
        <el-select v-model="types" placeholder="根据什么查询">
          <el-option label="房间编号" value="001"></el-option>
          <el-option label="房间名称" value="002"></el-option>
          <el-option label="全部" value=""></el-option>
        </el-select>
        <input type="text" placeholder="对应值" v-model="value">
        <a href="javascript:;" class="btn btn-info" @click="search">搜索</a>
      </div>
      <table class="table datatable-show-all">
        <thead>
        <tr>
          <th>房间类型编号</th>
          <th>房间类型名称</th>
          <th>房间类型简介</th>
          <th class="text-center">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in RoomTypeListKeyword">
          <td>{{item.rt_RoomTypeID}}</td>
          <td>{{item.rt_RoomTypeName}}</td>
          <td>{{item.rt_Remark}}</td>
          <td class="text-center">
            <ul class="icons-list">
              <li class="dropdown">
                <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                  <i class="icon-menu9"></i>
                </a>

                <ul class="dropdown-menu dropdown-menu-right">
                  <li><a href="javascript:;" @click="addRoomType"><i class="icon-add"></i>添加 </a></li>
                  <li><a href="javascript:;" @click="updateRoomType(item.rt_RoomTypeID)"><i class="icon-pencil"></i> 修改</a></li>
                  <li><a href="javascript:;" @click="deleteRoomType(item.rt_RoomTypeID)"><i class="icon-delicious"></i> 删除</a></li>
                </ul>
              </li>
            </ul>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <!--添加房间类型-->
    <el-dialog title="添加房间类型" :visible.sync="addRoomTypeDialog">
      <el-form :model="AddRoomType">
        <el-form-item label="类型编号" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="AddRoomType.RoomTypeID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型名称" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="AddRoomType.RoomTypeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="AddRoomType.Remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoomTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoomTypeSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改房间类型-->
    <el-dialog title="修改房间类型" :visible.sync="updateRoomTypeDialog">
      <el-form :model="initUpdateRoomType">
        <el-form-item label="类型编号" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="initUpdateRoomType.rt_RoomTypeID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型名称" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="initUpdateRoomType.rt_RoomTypeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="initUpdateRoomType.rt_Remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateRoomTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateRoomTypeSubmit">确 定</el-button>
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
        addRoomTypeDialog:false,//添加弹窗
        updateRoomTypeDialog:false,//修改弹窗
        formLabelWidth:'120px',
        isOff:true,
        AddRoomType:{
          RoomTypeID:'',
          RoomTypeName:'',
          Remark:''
        }
      }
    },
    computed:mapGetters([
        'RoomTypeListKeyword',
        'initUpdateRoomType'
    ]),
    methods:{
      //初始化数据
      initData(){
        POST('http://114.55.248.116:3333/HotelService.asmx/GetRoomTypeList',{
          condition:this.types,
          key:this.value
        },data=>{
          var data = JSON.parse(data);
          IsBackCode(data,this)
          if(data.backCode==200){
            this.$store.commit('initRoomTypeList',data.ht_RoomType)
          }
        })
      },
      //筛选
      search(){
        this.initData();
      },
      //添加
      addRoomType(){
        this.addRoomTypeDialog = true;
        this.$store.commit('setTranstionFalse')
      },
      //添加提交
      addRoomTypeSubmit(){
        if(this.AddRoomType.RoomTypeID.trim()==''||this.AddRoomType.RoomTypeName.trim()==''){
          this.$message({
            showClose: true,
            message: '房间编号或房间名称不能为空！',
            type: 'error'
          });
          return;
        }
        POST('http://114.55.248.116:3333/HotelService.asmx/AddRoomType',{
          RoomTypeID:this.AddRoomType.RoomTypeID,
          RoomTypeName:this.AddRoomType.RoomTypeName,
          Remark:this.AddRoomType.Remark,
        },data=>{
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
          this.addRoomTypeDialog = false;
        })
      },
      //修改
      updateRoomType(id){
        this.updateRoomTypeDialog = true;
        this.$store.commit('setTranstionFalse');
        this.$store.commit('initUpdateRoomType',id);
      },
      //修改提交
      updateRoomTypeSubmit(){
        POST('http://114.55.248.116:3333/HotelService.asmx/UpdateRoomType',{
          RoomTypeID:this.initUpdateRoomType.rt_RoomTypeID,
          RoomTypeName:this.initUpdateRoomType.rt_RoomTypeName,
          Remark:this.initUpdateRoomType.rt_Remark
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
          this.updateRoomTypeDialog = false;
        })
      },
      //删除
      deleteRoomType(id){
        POST('http://114.55.248.116:3333/HotelService.asmx/DeleteRoomType',{
          RoomTypeID:id
        },data=>{
          var data = JSON.parse(data);
          IsBackCode(data,this);
          if(data.backCode=='200'){
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.$store.commit('filterRoomType',id);
          }
        })
      }
    }
  }
</script>
<style scoped>

</style>
