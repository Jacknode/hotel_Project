<template>
  <div>
    <div class="panel panel-flat">
      <div class="panel-heading">
        <h5 class="panel-title">房间信息</h5>
      </div>
      <div class="dataTables_filter" id="hotelSearch">
        <span>房间信息筛选:</span>
        <input type="text" placeholder="房间编码" v-model="userSerach.RoomID">
        <input type="text" placeholder="房间名称" v-model="userSerach.RoomName">
        <input type="text" placeholder="酒店编号" v-model="userSerach.HotelID">
        <input type="text" placeholder="酒店名称" v-model="userSerach.HotelName">
        <input type="text" placeholder="酒店类型编号" v-model="userSerach.RoomTypeID">
        <input type="text" placeholder="酒店类型名称" v-model="userSerach.RoomTypeName">
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
          @change="changeDate"
        >
        </el-date-picker>
        <el-button type="info" plain @click="search">搜索</el-button>
      </div>
      <table class="table datatable-show-all">
        <thead>
        <tr>
          <th>房间编号</th>
          <th>房间类型名称</th>
          <th>酒店名称</th>
          <th>房间名称</th>
          <th>房间简介</th>
          <th>使用状态</th>
          <th>是否启用</th>
          <th class="text-center">操作</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="item in RoomListKeyword">
            <td>{{item.rm_RoomID}}</td>
            <td>{{item.rt_RoomTypeName}}</td>
            <td>{{item.ht_HotelName}}</td>
            <td>{{item.rm_RoomName}}</td>
            <td>{{item.rm_Remark}}</td>
            <td>{{item.rm_Status | getStatus}}</td>
            <td>{{item.rm_IsDelete==0?"启用":"不启用"}}</td>
            <td class="text-center">
              <ul class="icons-list">
                <li class="dropdown">
                  <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                    <i class="icon-menu9"></i>
                  </a>

                  <ul class="dropdown-menu dropdown-menu-right">
                    <li><a href="javascript:;" @click="addRoomInformation"><i class="icon-add"></i>添加 </a></li>
                    <li><a href="javascript:;" @click="updateRoomInformation(item.rm_RoomID)"><i class="icon-pencil"></i> 修改</a></li>
                    <li><a href="javascript:;" @click="deleteRoomInformation(item.rm_RoomID)"><i class="icon-delicious"></i> 删除</a></li>
                  </ul>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <el-pagination layout="prev, pager, next" :page-size="5" :total="hotelRoomTotal" style="float:right;margin-top: 20px"  @current-change="handleCurrentChange" v-show="hotelRoomTotal">
      </el-pagination>
    </div>
    <!--添加酒店房间-->
    <el-dialog title="添加酒店房间" :visible.sync="addRoomInformationDialog">
      <el-form :model="AddRoomInformation" >
        <el-form-item label="房间编码" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="AddRoomInformation.RoomID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="房间名称" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="AddRoomInformation.RoomName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="酒店名称" :label-width="'120px'" :required="isOff">
          <el-select v-model="AddRoomInformation.HotelID" placeholder="请选择酒店名称">
            <el-option
              v-for="item in useAll"
              :key="item.ht_HotelID"
              :label="item.ht_HotelName"
              :value="item.ht_HotelID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间类型" :label-width="'120px'" :required="isOff">
          <el-select v-model="AddRoomInformation.RoomTypeID" placeholder="请选择房间类型">
            <el-option
              v-for="item in RoomTypeListKeyword"
              :key="item.rt_RoomTypeID"
              :label="item.rt_RoomTypeName"
              :value="item.rt_RoomTypeID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间简介" :label-width="formLabelWidth">
          <el-input v-model="AddRoomInformation.Remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoomInformationDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoomInformationSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改酒店房间-->
    <el-dialog title="修改酒店房间" :visible.sync="updateRoomInformationDialog">
      <el-form :model="RoomObj" >
        <el-form-item label="房间编码" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="RoomObj.rm_RoomID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="房间名称" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="RoomObj.rm_RoomName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="酒店名称" :label-width="'120px'" :required="isOff">
          <el-select v-model="RoomObj.rm_HotelID" placeholder="请选择酒店名称">
            <el-option
              v-for="item in useAll"
              :key="item.ht_HotelID"
              :label="item.ht_HotelName"
              :value="item.ht_HotelID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间类型" :label-width="'120px'" :required="isOff">
          <el-select v-model="RoomObj.rm_RoomTypeID" placeholder="请选择房间类型">
            <el-option
              v-for="item in RoomTypeListKeyword"
              :key="item.rt_RoomTypeID"
              :label="item.rt_RoomTypeName"
              :value="item.rt_RoomTypeID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用状态" :label-width="'120px'" :required="isOff">
          <el-select v-model="RoomObj.rm_Status" placeholder="使用状态">
            <el-option label="空闲" value="0"></el-option>
            <el-option label="锁定" value="1"></el-option>
            <el-option label="使用" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="'120px'" :required="isOff">
          <el-select v-model="RoomObj.rm_IsDelete" placeholder="是否启用">
            <el-option label="启用" value="0"></el-option>
            <el-option label="不启用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间简介" :label-width="formLabelWidth">
          <el-input v-model="RoomObj.rm_Remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateRoomInformationDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateRoomInformationSubmit">确 定</el-button>
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
        hotelRoomTotal:0,
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
        addRoomInformationDialog:false,//添加弹窗
        updateRoomInformationDialog:false,//修改弹窗
        value7:'',
        formLabelWidth:'120px',
        isOff:true,
        //搜索参数
        userSerach:{
          RoomID:'',
          RoomName:'',
          HotelID:'',
          HotelName:'',
          RoomTypeID:'',
          RoomTypeName:'',
          Status:'',
          Delete:'',
          CreateFrom:'',
          CreateTo:'',
          PageNum:'1',
          Rows:'5'
        },
        //添加参数
        AddRoomInformation:{
          RoomID:'',
          HotelID:'',
          RoomTypeID:'',
          RoomName:'',
          Image1:'',
          Image2:'',
          Remark:''
        },
        types:'',
        value:'',//初始化搜索
      }
    },
    computed:mapGetters([
      'RoomListKeyword',
      'RoomTypeListKeyword',
      'useAll',
      'RoomObj'
    ]),
    methods:{
      //初始化数据
      initData(num){
        POST('http://114.55.248.116:3333/HotelService.asmx/GetRoomListByPage',{
          RoomID:this.userSerach.RoomID,
          RoomName:this.userSerach.RoomName,
          HotelID:this.userSerach.HotelID,
          HotelName:this.userSerach.HotelName,
          RoomTypeID:this.userSerach.RoomTypeID,
          RoomTypeName:this.userSerach.RoomTypeName,
          Status:this.userSerach.Status,
          Delete:this.userSerach.Delete,
          CreateFrom:this.value7[0]?this.value7[0]:'',
          CreateTo:this.value7[1]?this.value7[1]:'',
          Page:num,
          Rows:'5'
        },data=>{
          var data = JSON.parse(data);
          IsBackCode(data,this);
          this.hotelRoomTotal = Number(data.total)
          if(data.backCode=='200'){
            this.$store.commit('initRoomList',data.roomList);
          }
        })
      },
      //筛选
      search(){
        this.initData(1);
      },
      changeDate(){
//        console.log(this.value7)
      },
      //添加
      addRoomInformation(){
        this.addRoomInformationDialog = true;
        this.$store.commit('setTranstionFalse')
      },
      //添加确定
      addRoomInformationSubmit(){
        if(this.AddRoomInformation.RoomID.trim()==''||this.AddRoomInformation.HotelID.trim()==''||this.AddRoomInformation.RoomName.trim()==''){
          this.$message({
            showClose: true,
            message: '房间名或酒店名或房间编号不能输入空！',
            type: 'error'
          });
          return
        }
        POST('http://114.55.248.116:3333/HotelService.asmx/AddRoom',this.AddRoomInformation,
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
          this.addRoomInformationDialog = false;
        })
      },
      //删除
      deleteRoomInformation(id){
        POST('http://114.55.248.116:3333/HotelService.asmx/DeleteRoom',{
          RoomID:id
        },data=>{
          var data = JSON.parse(data);
          if(data.backCode=='200'){
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.$store.commit('filterRoom',id);
          }
        })
      },
      handleCurrentChange(num){
        this.initData(num);
      },
      //修改初始化
      updateRoomInformation(id){
        this.updateRoomInformationDialog = true;
        this.$store.commit('setTranstionFalse');
        this.$store.commit('setInitRoomObj',id)
      },
      //修改提交
      updateRoomInformationSubmit(){
        POST('http://114.55.248.116:3333/HotelService.asmx/UpdateRoom',{
          RoomID:this.RoomObj.rm_RoomID,
          HotelID:this.RoomObj.rm_HotelID,
          RoomTypeID:this.RoomObj.rm_RoomTypeID,
          RoomName:this.RoomObj.rm_RoomName,
          Remark:this.RoomObj.rm_Remark,
          Image1:'',
          Status:this.RoomObj.rm_Status,
          IsDelete:this.RoomObj.rm_IsDelete,
          Image2:''
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
          this.updateRoomInformationDialog = false;
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
  .newBlock{
    float: left;
    margin-left: 94px;
    margin-top: 5px;
    margin-right: 5px;
  }
  #search{
    margin-top: 5px;
  }
</style>
