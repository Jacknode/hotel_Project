<template>
  <div>
    <div class="panel panel-flat">
      <div class="panel-heading">
        <h5 class="panel-title">床铺信息</h5>
      </div>
      <div class="dataTables_filter" id="hotelSearch">
        <span>床铺信息筛选:</span>
        <input type="text" placeholder="床铺编号" v-model="userSerach.bBedID">
        <input type="text" placeholder="床铺名称" v-model="userSerach.bBedName">
        <input type="text" placeholder="房间编码" v-model="userSerach.RoomID">
        <input type="text" placeholder="床铺类型编号" v-model="userSerach.BedTypeID">
        <input type="text" placeholder="价格从" v-model="userSerach.PriceFrom">
        <input type="text" placeholder="价格到" v-model="userSerach.PriceTo">
        <el-select v-model="userSerach.Status" placeholder="使用状态">
          <el-option label="空闲" value="0"></el-option>
          <el-option label="锁定" value="1"></el-option>
          <el-option label="使用" value="2"></el-option>
          <el-option label="全部" value=""></el-option>
        </el-select>
        <el-select v-model="userSerach.Delete" placeholder="是否启用">
          <el-option label="启用" value="0"></el-option>
          <el-option label="不启用" value="1"></el-option>
          <el-option label="全部" value=""></el-option>
        </el-select>
        <el-date-picker
          v-model="value7"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions2"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <el-button type="primary" plain @click="search">搜索</el-button>
      </div>
      <table class="table datatable-show-all">
        <thead>
        <tr>
          <th>床铺编号</th>
          <th>床铺名称</th>
          <th>房间名称</th>
          <th>床铺类型</th>
          <th>床位价格</th>
          <th>使用状态</th>
          <th>是否启用</th>
          <th>床铺简介</th>
          <th class="text-center">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in HotelBedList">
          <td>{{item.b_BedID}}</td>
          <td>{{item.b_BedName}}</td>
          <td>{{item.rm_RoomName==""?"名称不存在":item.rm_RoomName}}</td>
          <td>{{item.b_BedTypeName==""?"类型不存在":item.b_BedTypeName}}</td>
          <td>¥ {{item.b_Price}}</td>
          <td>{{item.b_Status | getStatus}}</td>
          <td>{{item.b_IsDelete | getDelete}}</td>
          <td>{{item.b_Remark}}</td>
          <td class="text-center">
            <ul class="icons-list">
              <li class="dropdown">
                <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                  <i class="icon-menu9"></i>
                </a>

                <ul class="dropdown-menu dropdown-menu-right">
                  <li><a href="javascript:;" @click="addRoom"><i class="icon-add"></i>添加 </a></li>
                  <li><a href="javascript:;" @click="updateRoom(item.b_BedID)"><i class="icon-pencil"></i> 修改</a></li>
                  <li><a href="javascript:;" @click="deleteRoom(item.b_BedID)"><i class="icon-delicious"></i> 删除</a></li>
                </ul>
              </li>
            </ul>
          </td>
        </tr>
        </tbody>
      </table>
      <el-pagination layout="prev, pager, next" :page-size="5" :total="hotelBedTotal" style="float:right;margin-top: 20px"  @current-change="handleCurrentChange" v-show="hotelBedTotal">
      </el-pagination>
    </div>
    <!--添加床铺-->
    <el-dialog title="添加床铺" :visible.sync="addRoomDialog">
      <el-form :model="AddRoom" >
        <el-form-item label="床铺编号" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="AddRoom.bBedID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="床铺名称" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="AddRoom.bBedName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="房间名称" :label-width="'120px'" :required="isOff">
          <el-autocomplete
            v-model="bRoomName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入房间名称"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="床位价格" :label-width="formLabelWidth">
          <el-input v-model="AddRoom.bPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="床铺简介" :label-width="formLabelWidth">
          <el-input v-model="AddRoom.bRemark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoomDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoomSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改床铺-->
    <el-dialog title="修改床铺" :visible.sync="updateRoomDialog">
      <el-form :model="UpdateRoom" >
        <el-form-item label="床铺编号" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="UpdateRoom.b_BedID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="床铺名称" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="UpdateRoom.b_BedName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="房间名称" :label-width="'120px'" :required="isOff">
          <el-autocomplete
            v-model="updateRoomName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入房间名称"
            @select="updateHandleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="'120px'" :required="isOff">
          <el-select v-model="UpdateRoom.b_IsDelete" placeholder="是否启用">
            <el-option label="启用" value="0"></el-option>
            <el-option label="不启用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="床位价格" :label-width="formLabelWidth">
          <el-input v-model="UpdateRoom.b_Price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="床铺简介" :label-width="formLabelWidth">
          <el-input v-model="UpdateRoom.b_Remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateRoomDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateRoomSubmit">确 定</el-button>
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
        bRoomName:'',
        restaurants: [],
        state4: '',
        timeout: null,
        addRoomDialog:false,//添加弹窗
        updateRoomDialog:false,//修改弹窗
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value7:'',
        formLabelWidth:'120px',
        hotelBedTotal:0,
        isOff:true,
        //搜索参数
        userSerach:{
          bBedID:'',
          bBedName:'',
          RoomID:'',
          BedTypeID:'',
          PriceFrom:'',
          PriceTo:'',
          CreateFrom:'',
          CreateTo:'',
          Delete:'',
          Status:'',
          Page:'1',
          Rows:'5'
        },
        //添加参数
        AddRoom:{
          bBedID:'',
          bBedName:'',
          bRoomID:'',
          bPrice:'',
          bImageURL:'',
          bRemark:''
        },
        types:'',
        value:'',//初始化搜索
        updateRoomName:''
      }
    },
    computed:mapGetters([
      'HotelBedList',
      'UpdateRoom'
    ]),
    methods:{
      //添加搜索房间
      loadList(name) {
        return new Promise(function (relove,reject) {
          POST('http://114.55.248.116:3333/HotelService.asmx/GetRoomListByPage',{
              RoomID:'',
              RoomName:name==''?'豪华':name,
              HotelID:'',
              HotelName:'',
              RoomTypeID:'',
              RoomTypeName:'',
              Status:'',
              Delete:'',
              CreateFrom:'',
              CreateTo:'',
              Page:1,
              Rows:30
            },
            data=>{
              var data = JSON.parse(data);
              if(data.backCode==200){
                relove(data)
              }else{
                reject()
              }
            })
        })
      },
      querySearchAsync(queryString, cb) {
        this.loadList(queryString).then(data=>{
          data.roomList = data.roomList.map(item=>{
            return {
              id:item.rm_RoomID,
              value:item.rm_RoomName
            }
          });
          this.restaurants = data.roomList;
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(this.restaurants);
          }, 100 * Math.random());
        })
      },
      //添加修改id
      handleSelect(item) {
        this.AddRoom.bRoomID = item.id;
        this.bRoomName = item.value;
      },
      //修改id
      updateHandleSelect(item){
        this.UpdateRoom.b_RoomID = item.id;
        this.UpdateRoom.rm_RoomName = item.value;
        this.updateRoomName = item.value;
      },
      //初始化
      initData(num){
        POST('http://114.55.248.116:3333/HotelService.asmx/GetHotelBedList',{
          bBedID:this.userSerach.bBedID,
          BedName:this.userSerach.bBedName,
          RoomID:this.userSerach.RoomID,
          BedTypeID:this.userSerach.BedTypeID,
          PriceFrom:this.userSerach.PriceFrom,
          PriceTo:this.userSerach.PriceTo,
          CreateFrom:this.value7[0]?this.value7[0]:'',
          CreateTo:this.value7[1]?this.value7[1]:'',
          Delete:this.userSerach.Delete,
          Status:this.userSerach.Status,
          Page:num,
          Rows:this.userSerach.Rows,
        },data=>{
          var data = JSON.parse(data);
          IsBackCode(data,this);
          this.hotelBedTotal = Number(data.total)
          if(data.backCode=='200'){
            this.$store.commit('initHotelBedList',data.bedList);
          }
        })
      },
      //筛选
      search(){
        this.initData(1)
      },
      handleCurrentChange(num){
        this.initData(num)
      },
      addRoom(){
        this.addRoomDialog = true;
        this.$store.commit('setTranstionFalse')
      },
      //添加提交
      addRoomSubmit(){
        if(this.AddRoom.bBedID.trim()==''||this.AddRoom.bBedName.trim()==''||this.AddRoom.bPrice.trim()==''){
          this.$message({
            showClose: true,
            message: '输入内容不能输入空！',
            type: 'error'
          });
          return false;
        }
        if(isNaN(this.AddRoom.bPrice)){
          this.$message({
            showClose: true,
            message: '价格必须为数字!',
            type: 'error'
          });
          return false;
        }
        POST('http://114.55.248.116:3333/HotelService.asmx/AddHotelBed',this.AddRoom,
        data=>{
          var data = JSON.parse(data)
          IsBackCode(data,this);
          if(data.backCode==='200'){
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success'
            });
            this.initData(1)
          }
          this.addRoomDialog = false;
        })
      },
      //删除
      deleteRoom(id){
        POST('http://114.55.248.116:3333/HotelService.asmx/DeleteHotelBed',{
          bBedID:id
        },data=>{
          var data = JSON.parse(data);
          if(data.backCode=='200'){
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.$store.commit('filterHotelBed',id);
          }
        })
      },
      //修改
      updateRoom(id){
        this.updateRoomDialog = true;
        this.$store.commit('setTranstionFalse');
        this.$store.commit('setUpdateRoom',id);
      },
      //修改提交
      updateRoomSubmit(){
        POST('http://114.55.248.116:3333/HotelService.asmx/UpdateHotelBed',{
          bBedID:this.UpdateRoom.b_BedID,
          bBedName:this.UpdateRoom.b_BedName,
          bRoomID:this.UpdateRoom.b_RoomID,
          bPrice:this.UpdateRoom.b_Price,
          bImageURL:'',
          Delete:this.UpdateRoom.b_IsDelete,
          bRemark:this.UpdateRoom.b_Remark,
        },data=>{
          var data = JSON.parse(data);
          IsBackCode(data,this);
          if(data.backCode=='200'){
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            });
            this.initData(1)
          }
          this.updateRoomDialog = false;
        })
      }
    }
  }
</script>
<style scoped>
  #hotelSearch span{
    line-height:34px;
    float: left;
    margin-right: 5px;
  }
  #hotelSearch .block{
    width: 200px;
    margin-right: 5px;
    margin-top: 5px;
  }
  #hotelSearch input{
    float: left;
    margin-right: 5px;
    width: 124px;
  }
</style>
