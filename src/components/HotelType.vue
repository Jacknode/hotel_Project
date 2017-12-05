<template>
  <div>
    <div class="panel panel-flat">
      <div class="panel-heading">
        <h5 class="panel-title">酒店类型管理</h5>
      </div>
      <div class="dataTables_filter"  id="hotelSearch">
        <span>类型名称筛选:</span>
        <input type="text" placeholder="酒店编码" v-model="userSerach.HotelTypeID">
        <input type="text" placeholder="酒店名称" v-model="userSerach.HotelTypeName">
        <div class="block">
          <el-date-picker
            v-model="userSerach.CreatedTimeFrom"
            type="date"
            placeholder="创建日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
        <el-select v-model="userSerach.Delete" placeholder="是否删除">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
        <a href="javascript:;" class="btn btn-info" @click="search">搜索</a>
      </div>
      <table class="table datatable-show-all">
        <thead>
        <tr>
          <th>类型编码</th>
          <th>类型名称</th>
          <th>类型创建时间</th>
          <th>类型简介</th>
          <th>是否删除</th>
          <th class="text-center">操作</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="item in HotelTypeListKeyword">
            <td>{{item.htt_HotelTypeID}}</td>
            <td>{{item.htt_HotelTypeName}}</td>
            <td>{{item.htt_CreatedTime | getNewDate}}</td>
            <td>{{item.htt_Remark}}</td>
            <td>{{item.htt_IsDelete==0?"否":"是"}}</td>
            <td class="text-center">
              <ul class="icons-list">
                <li class="dropdown">
                  <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                    <i class="icon-menu9"></i>
                  </a>

                  <ul class="dropdown-menu dropdown-menu-right">
                    <li><a href="javascript:;" @click="addHotelType"><i class="icon-add"></i>添加 </a></li>
                    <li><a href="javascript:;" @click="updateHotelType(item.htt_HotelTypeID)"><i class="icon-pencil"></i> 修改</a></li>
                    <li><a href="javascript:;" @click="deleteHotelType(item.htt_HotelTypeID,item.htt_IsDelete)"><i class="icon-delicious"></i> 删除</a></li>
                  </ul>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <!--<el-pagination layout="prev, pager, next" :page-size="5" :total="hotelTypeTotal" style="float:right;margin-top: 20px"  @current-change="handleCurrentChange">-->
      <!--</el-pagination>-->
    </div>
    <!--添加酒店类型-->
    <el-dialog title="添加酒店类型" :visible.sync="addHotelTypeDialog">
      <el-form :model="AddHotelType"  :rules="rules" ref="ruleForm">
        <el-form-item label="类型名称" :label-width="formLabelWidth" prop="HotelTypeName" :required="isOff">
          <el-input v-model="AddHotelType.HotelTypeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth"  prop="Remark">
          <el-input v-model="AddHotelType.Remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addHotelTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="addHotelTypeSubmit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改酒店类型-->
    <el-dialog title="修改酒店类型" :visible.sync="updateHotelTypeDialog">
      <el-form :model="initUpdateHotelTypeObj" >
        <el-form-item label="类型编号" :label-width="formLabelWidth" :required="isOff" >
          <el-input v-model="initUpdateHotelTypeObj.htt_HotelTypeID" auto-complete="off"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="类型名称" :label-width="formLabelWidth">
          <el-input v-model="initUpdateHotelTypeObj.htt_HotelTypeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-select v-model="initUpdateHotelTypeObj.htt_IsDelete" placeholder="请选择启用状态">
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="initUpdateHotelTypeObj.htt_Remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateHotelTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateHotelTypeSubmit">确 定</el-button>
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
        userSerach:{
          HotelTypeID:'',
          HotelTypeName:'',
          CreatedTimeFrom:'',
          Delete:'',
          Page:'1',
          CreatedTimeTo:'',
          Rows:'500'
        },
        loading:true,
        isOff:true,
        initHotelType:'',//初始化搜索
        addHotelTypeDialog:false,//添加弹窗
        updateHotelTypeDialog:false,//修改弹窗
        formLabelWidth:'120px',
        AddHotelType:{
          HotelTypeName:'',
          Remark:''
        },
        rules:{
          HotelTypeName:[
            { required: true, message: '请输入类型名称', trigger: 'blur' },
            { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
          ],
          Remark:[
            { required: false, message: '请输入简介', trigger: 'blur' },
            { min: 0, max: 120, message: '长度在 2 到 120 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    computed:mapGetters([
        'HotelTypeListKeyword',
        'initUpdateHotelTypeObj',
        'hotelTypeTotal'
    ]),
    methods:{
      //筛选
      search(){
        this.initData(1)
      },
      //初始化数据
      initData(num){
        POST('http://114.55.248.116:3333/HotelService.asmx/GetHotelTypeList',{
          HotelTypeID:this.userSerach.HotelTypeID,
          HotelTypeName:this.userSerach.HotelTypeName,
          CreatedTimeFrom:this.userSerach.CreatedTimeFrom,
          CreatedTimeTo:this.userSerach.CreatedTimeTo,
          Delete:this.userSerach.Delete,
          Page:num,
          Rows:this.userSerach.Rows
        },(data)=>{
          var data = JSON.parse(data);
          IsBackCode(data,this)
          if(data.backCode==200){
            if(num==1){
              this.$message({
                showClose: true,
                message: '获取商户类型成功！',
                type: 'success'
              });
            }
            this.$store.commit('setHotelTypeTotal',Number(data.total))
            this.$store.commit('initHotelTypeList',data.hotelTypeList)
          }
        })
      },
      //添加酒店类型
      addHotelType(){
        this.addHotelTypeDialog = true;
        this.$store.commit('setTranstionFalse')
      },
      //添加类型确定
      addHotelTypeSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            POST('http://114.55.248.116:3333/HotelService.asmx/AddHotelType',this.AddHotelType,(data)=>{
              var data = JSON.parse(data)
              if(data.backCode==='200'){
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                });
                this.initData(1)
              }
              this.addHotelTypeDialog = false;
            })
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
      handleCurrentChange(num){
        this.initData(num)
      },
      //初始化修改数据
      updateHotelType(id){
        this.updateHotelTypeDialog = true;
        this.$store.commit('setTranstionFalse')
        this.$store.commit('setInitObj',id)
      },
      updateHotelTypeSubmit(){
        if(this.initUpdateHotelTypeObj.htt_HotelTypeName==''||this.initUpdateHotelTypeObj.htt_IsDelete==''){
          this.$message({
            showClose: true,
            message: '请输入内容！',
            type: 'error'
          });
          this.updateHotelTypeDialog = false;
          return;
        }
        POST('http://114.55.248.116:3333/HotelService.asmx/UpdateHotelType',{
          HotelTypeID:this.initUpdateHotelTypeObj.htt_HotelTypeID,
          HotelTypeName:this.initUpdateHotelTypeObj.htt_HotelTypeName,
          Delete:this.initUpdateHotelTypeObj.htt_IsDelete,
          Remark:this.initUpdateHotelTypeObj.htt_Remark
        },(data)=>{
          var data = JSON.parse(data)
          if(data.backCode==='200'){
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            });
            this.initData(1)
          }
          this.updateHotelTypeDialog = false;
        })
      },
      //删除酒店类型
      deleteHotelType(id,delId){
        if(delId==1){
          this.$message({
            showClose: true,
            message: '已删除',
            type: 'error'
          });
          return
        }
        POST('http://114.55.248.116:3333/HotelService.asmx/DeleteHotelType',{
          HotelTypeID:id
        },data=>{
          var data = JSON.parse(data);
          if(data.backCode=='200'){
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.$store.commit('filterHotelType',id);
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
