<template>
  <div>
    <div class="panel panel-flat">
      <div class="panel-heading">
        <h5 class="panel-title">商户信息</h5>
      </div>
      <div class="dataTables_filter" id="hotelSearch">
        <span>酒店商户筛选:</span>
        <input type="text" placeholder="酒店编码" v-model="userSerach.HotelID">
        <input type="text" placeholder="酒店名称" v-model="userSerach.HotelName">
        <input type="text" placeholder="酒店类型编码" v-model="userSerach.HotelTypeID">
        <input type="text" placeholder="电话号码" v-model="userSerach.HotelPhone">
        <input type="text" placeholder="手机号码" v-model="userSerach.HotelTel">
        <div class="block">
          <el-date-picker
            v-model="userSerach.HotelTimeFrom"
            type="date"
            placeholder="创建日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
        <div class="block">
          <el-date-picker
            v-model="userSerach.HotelTimeTo"
            type="date"
            placeholder="到期日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
        <a href="javascript:;" class="btn btn-info" @click="search" id="search">搜索</a>
      </div>
      <table class="table datatable-show-all">
        <thead>
        <tr>
          <th>酒店编码</th>
          <th>酒店名称</th>
          <th>酒店类型</th>
          <th>电话号码</th>
          <th>手机号码</th>
          <th>创建日期</th>
          <th>是否删除</th>
          <th class="text-center">操作</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="item in hotelUsersKeyword">
            <td>{{item.ht_HotelID}}</td>
            <td>{{item.ht_HotelName}}</td>
            <td>{{item.HotelTypeName}}</td>
            <td>{{item.ht_Phone}}</td>
            <td>{{item.ht_TelePhone}}</td>
            <td>{{item.ht_CreateTime | getNewDate}}</td>
            <td>{{item.ht_IsDelete==0?"否":"是"}}</td>
            <td class="text-center">
              <ul class="icons-list">
                <li class="dropdown">
                  <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                    <i class="icon-menu9"></i>
                  </a>

                  <ul class="dropdown-menu dropdown-menu-right">
                    <li><a href="javascript:;" @click="addHotelUser"><i class="icon-add"></i>添加 </a></li>
                    <li><a href="javascript:;" @click="updateHotelUser(item.ht_HotelID)"><i class="icon-pencil"></i> 修改</a></li>
                    <li><a href="javascript:;" @click="deleteHotelUser(item.ht_HotelID)"><i class="icon-delicious"></i> 删除</a></li>
                  </ul>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <el-pagination layout="prev, pager, next" :page-size="5" :total="hotelUserTotal" style="float:right;margin-top: 20px"  @current-change="handleCurrentChange" v-show="hotelUserTotal">
      </el-pagination>
    </div>
    <!--添加酒店商户-->
    <el-dialog title="添加酒店商户" :visible.sync="addHotelUserDialog">
      <el-form :model="AddHotelUser"  :rules="rules" ref="ruleForm">
        <el-form-item label="酒店编码" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="AddHotelUser.HotelID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="酒店名称" :label-width="formLabelWidth"  prop="HotelName">
          <el-input v-model="AddHotelUser.HotelName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="酒店密码" :label-width="formLabelWidth"  prop="HotelPassword" :required="isOff">
          <el-input v-model="AddHotelUser.Password" auto-complete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码"  :label-width="formLabelWidth" prop="HotelCheckPassword" :required="isOff">
          <el-input type="password" v-model="AddHotelUser.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="酒店类型" :label-width="'120px'" :required="isOff">
          <el-select v-model="AddHotelUser.HotelTypeID" placeholder="请选择酒店类型">
            <el-option
              v-for="item in HotelTypeListKeyword"
              :key="item.htt_HotelTypeID"
              :label="item.htt_HotelTypeName"
              :value="item.htt_HotelTypeID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="酒店手机号码" :label-width="formLabelWidth" >
          <el-input v-model="AddHotelUser.TelePhone" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addHotelUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addHotelUserSubmit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改酒店商户-->
    <el-dialog title="修改酒店商户" :visible.sync="UpdateHotelUserDialog">
      <el-form :model="initUpdateObj">
        <el-form-item label="酒店编码" :label-width="formLabelWidth"  :required="isOff">
          <el-input v-model="initUpdateObj.ht_HotelID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="酒店名称" :label-width="formLabelWidth"  :required="isOff">
          <el-input v-model="initUpdateObj.ht_HotelName" auto-complete="off"></el-input>
        </el-form-item>
        </el-form-item>
        <el-form-item label="酒店类型" :label-width="'120px'">
          <el-select v-model="initUpdateObj.ht_HotelTypeID" placeholder="请选择酒店类型">
            <el-option
              v-for="item in HotelTypeListKeyword"
              :key="item.htt_HotelTypeID"
              :label="item.htt_HotelTypeName"
              :value="item.htt_HotelTypeID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="酒店地址" :label-width="formLabelWidth">
          <el-input v-model="initUpdateObj.ht_HotelAddress" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth" >
          <el-input v-model="initUpdateObj.ht_TelePhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" :label-width="formLabelWidth" >
          <el-input v-model="initUpdateObj.ht_Phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="省" :label-width="formLabelWidth" >
          <el-input v-model="initUpdateObj.ht_HotelProvice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="市" :label-width="formLabelWidth" >
          <el-input v-model="initUpdateObj.ht_City" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="县" :label-width="formLabelWidth" >
          <el-input v-model="initUpdateObj.ht_Contry" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否删除" :label-width="formLabelWidth" :required="isOff">
          <el-select v-model="initUpdateObj.ht_IsDelete" placeholder="请选择删除状态">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" >
          <el-input v-model="initUpdateObj.ht_Remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="UpdateHotelUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateHotelUserSubmit">确 定</el-button>
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
        //搜索参数
        userSerach:{
          HotelID:'',
          HotelName:'',
          HotelTypeID:'',
          HotelPhone:'',
          HotelTel:'',
          HotelTimeFrom:'',
          HotelTimeTo:'',
          PageNum:'1',
          Rows:'5'
        },
        isOff:true,
        hotelUserTotal:0,
        addHotelUserDialog:false,//添加弹窗
        UpdateHotelUserDialog:false,//修改弹窗
        formLabelWidth:'120px',
        //添加参数
        AddHotelUser:{
          HotelID:'',
          HotelName:'',
          Password:'',
          HotelTypeID:'',
          checkPass:'',
          TelePhone:''
        },
        rules:{
          HotelName:[
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 0, max: 120, message: '长度在 2 到 120 个字符', trigger: 'blur' }
          ],
          HotelPassword: [
            { required: false, message: '请输入密码', trigger: 'blur' },
            { min: 0, max: 120, message: '长度在 2 到 120 个字符', trigger: 'blur' }
          ],
          HotelCheckPassword: [
            { required: false, message: '请再次输入密码', trigger: 'blur' },
            { min: 0, max: 120, message: '长度在 2 到 120 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    computed:mapGetters([
        'hotelUsersKeyword',
        'HotelTypeListKeyword',
        'initUpdateObj'
    ]),
    methods:{
      //初始化数据
      initData(num){
        POST('http://114.55.248.116:3333/HotelService.asmx/GetHotelList',{
            HotelID:this.userSerach.HotelID,
            HotelName:this.userSerach.HotelName,
            HotelTypeID:this.userSerach.HotelTypeID,
            HotelPhone:this.userSerach.HotelPhone,
            HotelTel:this.userSerach.HotelTel,
            HotelTimeFrom:this.userSerach.HotelTimeFrom,
            HotelTimeTo:this.userSerach.HotelTimeTo,
            PageNum:num,
            Rows:5
          },
          data=>{
            var data = JSON.parse(data)
            IsBackCode(data,this);
            if(data.backCode=='200'){
              if(num==1){
                this.$message({
                  showClose: true,
                  message: '获取商户信息成功！',
                  type: 'success'
                });
              }
              this.hotelUserTotal = Number(data.total)
              this.$store.commit('setInitHotelUsers',data.hotelList)
            }
          })
      },
      //筛选
      search(){
        if(isNaN(this.userSerach.HotelPhone)||isNaN(this.userSerach.HotelTel)||isNaN(this.userSerach.HotelID)||isNaN(this.userSerach.HotelTypeID)){
          this.$message({
            showClose: true,
            message: '输入有误！',
            type: 'error'
          });
          return
        }
        this.initData(1)
      },
      handleCurrentChange(num){
        this.initData(num);
      },
      //点击添加
      addHotelUser(){
        this.addHotelUserDialog = true;
        this.$store.commit('setTranstionFalse')
      },
      //添加提交
      addHotelUserSubmit(formName){
        console.log(this.AddHotelUser)
        if(this.AddHotelUser.Password!==this.AddHotelUser.checkPass){
          this.$message({
            showClose: true,
            message: '两次输入密码不一致！',
            type: 'error'
          });
          return;
        }
        if(isNaN(this.AddHotelUser.HotelID)||isNaN(this.AddHotelUser.TelePhone)){
          this.$message({
            showClose: true,
            message: '酒店编号或者电话号码不是数字',
            type: 'error'
          });
          return;
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.commit('showLoading');
            POST('http://114.55.248.116:3333/HotelService.asmx/AddHotel',{
                HotelID:this.AddHotelUser.HotelID,
                HotelName:this.AddHotelUser.HotelName,
                HotelTypeID:this.AddHotelUser.HotelTypeID,
                Password:this.AddHotelUser.Password,
                TelePhone:this.AddHotelUser.TelePhone,
              },
              data=>{
                var data = JSON.parse(data)
                if(data.backCode==='200'){
                  this.$store.commit('hideLoading');
                  this.$message({
                    showClose: true,
                    message: '添加成功',
                    type: 'success'
                  });
                  this.initData(1)
                }
                this.addHotelUserDialog = false;
              }
            )
          } else {
            this.$message({
              showClose: true,
              message: '输入有误！',
              type: 'error'
            });
            return false;
          }
        });
      },
      //修改初始化
      updateHotelUser(id){
        this.UpdateHotelUserDialog = true;
        this.$store.commit('setTranstionFalse')
        this.$store.commit('setInitUpdateObj',id)
      },
      //修改提交
      updateHotelUserSubmit(){
        if(isNaN(this.initUpdateObj.ht_HotelID)||isNaN(this.initUpdateObj.ht_TelePhone)||isNaN(this.initUpdateObj.ht_Phone)){
          this.$message({
            showClose: true,
            message: '酒店编号或者电话号码不是数字',
            type: 'error'
          });
          return;
        }
        POST('http://114.55.248.116:3333/HotelService.asmx/UpdateHotel',{
          HotelID:this.initUpdateObj.ht_HotelID,
          HotelName:this.initUpdateObj.ht_HotelName,
          HotelTypeID:this.initUpdateObj.ht_HotelTypeID,
          HotelAddress:this.initUpdateObj.ht_HotelAddress,
          HotelProvice:this.initUpdateObj.ht_HotelProvice,
          City:this.initUpdateObj.ht_City,
          Contry:this.initUpdateObj.ht_Contry,
          Phone:this.initUpdateObj.ht_Phone,
          TelePhone:this.initUpdateObj.ht_TelePhone,
          ShowImage1Url:'',
          ShowImage2Url:'',
          Delete:this.initUpdateObj.ht_IsDelete,
          Remark:this.initUpdateObj.ht_Remark
        },data=>{
          var data = JSON.parse(data)
          if(data.backCode==='200'){
            this.$store.commit('hideLoading');
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            });
            this.initData(1)
          }
          this.UpdateHotelUserDialog = false;
        })
      },
      //删除
      deleteHotelUser(id){
        POST('http://114.55.248.116:3333/HotelService.asmx/DeleteHotel',{
          HotelID:id
        },data=>{
          var data = JSON.parse(data);
          if(data.backCode=='200'){
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.$store.commit('filterHotelUser',id);
          }
        })
      }
    },
    mounted(){
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
    float: left;
    width: 200px;
    margin-right: 5px;
  }
#hotelSearch input{
  float: left;
  margin-right: 5px;
  width: 100px;
}
</style>
