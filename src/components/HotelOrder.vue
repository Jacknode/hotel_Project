<template>
  <div>
    <div class="panel panel-flat">
      <div class="panel-heading">
        <h5 class="panel-title">酒店订单信息</h5>
      </div>
      <div class="dataTables_filter">
        <span>订单筛选:</span>
        <el-select v-model="userSearch.payStatus" placeholder="支付状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="未支付" value="0"></el-option>
          <el-option label="已支付" value="1"></el-option>
        </el-select>
        <el-select v-model="userSearch.useStatus" placeholder="入住状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="未入住" value="0"></el-option>
          <el-option label="已入住" value="1"></el-option>
        </el-select>
        <el-date-picker
          v-model="value7"
          type="daterange"
          align="left"
          unlink-panels
          range-separator="至"
          start-placeholder="入住日期"
          end-placeholder="离店日期"
          :picker-options="pickerOptions2"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <input type="text" placeholder="价格从" v-model="userSearch.priceFrom">
        <input type="text" placeholder="价格到" v-model="userSearch.priceTo">
        <a href="javascript:;" class="btn btn-info" @click="search">搜索</a>
      </div>
      <table class="table datatable-show-all">
        <thead>
        <tr>
          <th>订单号</th>
          <th>用户名</th>
          <th>酒店名</th>
          <th>房间名</th>
          <th>房间价格</th>
          <th>支付状态</th>
          <th>入住状态</th>
          <th>售票员名称</th>
          <th>入住日期</th>
          <!--<th>离店日期</th>-->
          <!--<th>虚拟票号</th>-->
          <th>是否启用</th>
          <th>支付时间</th>
          <!--<th>支付方式</th>-->
          <th class="text-center">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in HotelOrderList">
          <td>{{item.ho_OrderId}}</td>
          <td>{{item.ho_UserName}}</td>
          <td>{{item.ho_HotelName}}</td>
          <td>{{item.ho_RoomName}}</td>
          <td>¥ {{item.ho_Price}}</td>
          <td>{{item.ho_PayStatus==0?"未支付":"已支付"}}</td>
          <td>{{item.ho_UseStatus | getUseStatus}}</td>
          <td>{{item.ho_SellName}}</td>
          <td>{{item.ho_FromDate}}</td>
          <!--<td>{{item.ho_ToDate}}</td>-->
          <!--<td>{{item.ho_TicketID}}</td>-->
          <td>{{item.ho_IsDelete==0?"启用":"不启用"}}</td>
          <td>{{item.ho_PayTime | getNewDate}}</td>
          <!--<td>{{item.ho_PayWay}}</td>-->
          <td class="text-center">
            <ul class="icons-list">
              <li class="dropdown">
                <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                  <i class="icon-menu9"></i>
                </a>

                <ul class="dropdown-menu dropdown-menu-right">
                  <li><a href="javascript:;" @click="updateOrder(item.ho_OrderId)"><i class="icon-pencil"></i> 修改</a></li>
                  <li><a href="javascript:;" @click="deleteOrder(item.ho_OrderId)"><i class="icon-delicious"></i> 删除</a></li>
                </ul>
              </li>
            </ul>
          </td>
        </tr>
        </tbody>
      </table>
      <el-pagination layout="prev, pager, next" :page-size="5" :total="hotelOrderTotal" style="float:right;margin-top: 20px"  @current-change="handleCurrentChange" v-show="hotelOrderTotal">
      </el-pagination>
    </div>
    <!--修改酒店订单-->
    <el-dialog title="修改酒店订单" :visible.sync="updateOrderDialog">
      <el-form :model="updateOrderObj">
        <el-form-item label="订单号" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="updateOrderObj.ho_OrderId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付状态" :label-width="'120px'" :required="isOff">
          <el-select v-model="updateOrderObj.ho_PayStatus" placeholder="支付状态">
            <el-option label="未支付" value="0"></el-option>
            <el-option label="已支付" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入住状态" :label-width="'120px'" :required="isOff">
          <el-select v-model="updateOrderObj.ho_UseStatus" placeholder="入住状态">
            <el-option label="未入住" value="0"></el-option>
            <el-option label="已入住" value="1"></el-option>
            <el-option label="已退房" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="虚拟票号" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="updateOrderObj.ho_TicketID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付字符串" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="updateOrderObj.ho_PaySign" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateOrderDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateOrderSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {POST,IsBackCode,postPromise} from '../assets/js/public'
  export default{
    name: '',
    data(){
      return {
        formLabelWidth:'120px',
        updateOrderDialog:false,
        isOff:true,
        hotelOrderTotal:0,
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
        types:'',
        value:'',//初始化搜索
        value7:'',
        userSearch:{
          priceFrom:'',
          priceTo:'',
          payStatus:'',
          useStatus:''
        }
      }
    },
    computed:mapGetters([
      'HotelOrderList',
      'updateOrderObj'
    ]),
    methods:{
      //初始化数据
      initData(num){
        POST('http://114.55.248.116:3333/HotelService.asmx/GetHotelOrderListByPage',{
          OrderID:'',
          UserID:'',
          UserName:'',
          HotelID:'',
          HotelName:'',
          RoomID:'',
          RoomName:'',
          PriceFrom:this.userSearch.priceFrom,
          PriceTo:this.userSearch.priceTo,
          PayStatus:this.userSearch.payStatus,
          UseStatus:this.userSearch.useStatus,
          SellID:'',
          SellName:'',
          FromDate:this.value7[0]?this.value7[0]:'',
          ToDate:this.value7[1]?this.value7[1]:'',
          Password:'',
          TicketID:'',
          CreateTimeFrom:'',
          CreateTimeTo:'',
          PayWay:'',
          IsDelete:'',
          Page:num,
          Rows:5
        },data=>{
          console.log(JSON.parse(data));
          var data = JSON.parse(data);
          IsBackCode(data,this);
          this.hotelOrderTotal = Number(data.total);
          if(data.backCode==200){
            this.$store.commit('initHotelOrder',data.hotelOrderList);
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
      //修改
      updateOrder(id){
        this.updateOrderDialog = true;
        this.$store.commit('setTranstionFalse');
        this.$store.commit('setHotelOrderObj',id)
      },
      //修改提交
      updateOrderSubmit(){
        postPromise('http://114.55.248.116:3333/HotelService.asmx/UpdateHotelOrder',{
          OrderId:this.updateOrderObj.ho_OrderId,
          PayStatus:this.updateOrderObj.ho_PayStatus,
          UseStatus:this.updateOrderObj.ho_UseStatus,
          TicketID:this.updateOrderObj.ho_TicketID,
          PaySign:this.updateOrderObj.ho_PaySign,
          WebServiceFee:0
        })
          .then(data=>{
            var data = JSON.parse(data);
            IsBackCode(data,this);
            console.log(data)
            if(data.backCode=='200'){
              this.$message({
                showClose: true,
                message: '修改成功',
                type: 'success'
              });
              this.initData(1)
            }
            this.updateOrderDialog = false;
          })
      },
      //删除
      deleteOrder(id){
        postPromise('http://114.55.248.116:3333/HotelService.asmx/DeleteHotelOrder',{
          OrderId:id
        })
          .then(data=>{
            var data = JSON.parse(data);
            console.log(data)
            if(data.backCode=='200'){
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
              this.$store.commit('filterHotelOrder',id);
            }
          })
      }
    }
  }
</script>
<style scoped>

</style>
