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
        </el-select>
        <input type="text" placeholder="对应值" v-model="value">
        <a href="javascript:;" class="btn btn-info" @click="search">搜索</a>
      </div>
      <table class="table datatable-show-all">
        <thead>
        <tr>
          <th>房间编号</th>
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
                  <li><a href="javascript:;"><i class="icon-add"></i>添加 </a></li>
                  <li><a href="javascript:;"><i class="icon-pencil"></i> 修改</a></li>
                  <li><a href="javascript:;"><i class="icon-delicious"></i> 删除</a></li>
                </ul>
              </li>
            </ul>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
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
        value:''//初始化搜索
      }
    },
    computed:mapGetters([
      'RoomTypeListKeyword'
    ]),
    methods:{
      //筛选
      search(){
        POST('http://114.55.248.116:3333/HotelService.asmx/GetRoomTypeList',{
          condition:this.types,
          key:this.value
        },data=>{
          console.log(JSON.parse(data));
        })
      }
    }
  }
</script>
<style scoped>

</style>
