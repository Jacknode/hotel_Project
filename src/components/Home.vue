<template>
  <div>
    <div class="navbar navbar-inverse">
      <div class="navbar-header">
        <a class="navbar-brand" href="javascript:;">酒店后台管理系统</a>
        <ul class="nav navbar-nav visible-xs-block">
          <li><a data-toggle="collapse" data-target="#navbar-mobile"><i class="icon-tree5"></i></a></li>
          <li><a class="sidebar-mobile-main-toggle"><i class="icon-paragraph-justify3"></i></a></li>
        </ul>
      </div>
      <div class="navbar-collapse collapse" id="navbar-mobile">
        <ul class="nav navbar-nav">
          <li><a class="sidebar-control sidebar-main-toggle hidden-xs"><i class="icon-paragraph-justify3"></i></a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li class="dropdown dropdown-user">
            <a class="dropdown-toggle" data-toggle="dropdown">
              <!--<img src="assets/images/placeholder.jpg" alt="">-->
              <span>管理员</span>
              <i class="caret"></i>
            </a>
            <ul class="dropdown-menu dropdown-menu-right">
              <li @click="getUser"><a href="javascript:;"><i class="icon-user-plus"></i>{{qiankeUser?qiankeUser:''}}</a></li>
              <li @click="Quit"><a href="javascript:;"><i class="icon-switch2"></i>退出</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <!-- /main navbar -->
    <!-- Page container -->
    <div class="page-container">

      <!-- Page content -->
      <div class="page-content">

        <!-- Main sidebar 左边导航栏开始-->
        <div class="sidebar sidebar-main">
          <div class="sidebar-content">

            <!-- User menu -->
            <div class="sidebar-user">
              <div class="category-content">
                <div class="media">
                  <a href="javascript:;" class="media-left">
                    <!--<img src="assets/images/placeholder.jpg" class="img-circle img-sm" alt="">-->
                  </a>
                  <div class="media-body">
                    <span class="media-heading text-semibold">欢迎您:{{qiankeUser?qiankeUser:''}}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- /user menu -->
            <!-- Main navigation -->
            <div class="sidebar-category sidebar-category-visible">
              <div class="category-content no-padding">
                <ul class="navigation navigation-main navigation-accordion">
                  <!-- Main -->
                  <li class="navigation-header"><span>Main</span> <i class="icon-menu" title="Main pages"></i></li>
                  <li>
                    <a href="javascript:;"><i class="icon-stack2"></i> <span>酒店信息管理</span></a>
                    <ul>
                      <!--<li>-->
                        <!--<router-link to="/home/demo">测试</router-link>-->
                      <!--</li>-->
                      <li>
                        <router-link to="/home/hotelUser">酒店商户管理</router-link>
                      </li>
                      <li>
                        <router-link to="/home/hotelOrder">酒店订单管理</router-link>
                      </li>
                      <li>
                        <router-link to="/home/roomInformation">房间信息管理</router-link>
                      </li>
                      <li>
                        <router-link to="/home/bedInformation">床铺信息管理</router-link>
                      </li>
                      <li>
                        <router-link to="/home/hotelType">酒店类型管理</router-link>
                      </li>
                      <li>
                        <router-link to="/home/roomType">房间类型管理</router-link>
                      </li>
                      <li>
                        <router-link to="/home/bedType">床铺类型管理</router-link>
                      </li>
                    </ul>
                  </li>
                  <!-- /main -->
                </ul>
              </div>
            </div>
            <!-- /main navigation-->
          </div>
        </div>
        <!-- /main sidebar  左边导航栏结束-->
        <!--右边内容-->
        <div class="content-wrapper">

          <div class="content" :class="{ 'animated': transtionActive.isActive, 'rollIn': transtionActive.isRotateInDownRight }">
            <!-- Page length options -->
            <!-- /page length options -->
            <router-view name="User"></router-view>

            <!-- Footer -->
            <!--<div class="footer text-muted">-->
            <!--&copy; 2015. <a href="#">Limitless Web App Kit</a> by <a href="http://themeforest.net/user/Kopyov" target="_blank">Eugene Kopyov</a>-->
            <!--</div>-->
            <!-- /footer -->
          </div>
        </div>
        <!--右边内容结束-->
        <!-- Footer -->
        <div class="footer text-muted">
        </div>
        <!-- /footer -->
      </div>
      <!-- /content area -->
    </div>
    <!-- /main content -->
  </div>
  <!-- /page content -->
</template>
<script>
  import {mapGetters} from 'vuex'
  import {POST,IsBackCode} from '../assets/js/public'
  export default{
    name: '',
    data(){
      return {
        qiankeUser:'',
      }
    },
    computed:mapGetters([
      'user',
      'transtionActive',
    ]),
    mounted(){
      this.initData()
      if(!JSON.parse(sessionStorage.getItem('isLogin'))){
        this.$router.push({name:'Login'})
      }
      var user = sessionStorage.getItem('admin');
      this.qiankeUser = user;
    },
    watch: {
      '$route' (to, from) {
        this.$store.commit('clearAll')
        // 对路由变化作出响应...
        if(this.transtionActive.isActive&&this.transtionActive.isRotateInDownRight){
          this.$store.commit('setTranstionFalse')
        }
        setTimeout(()=>{
          this.$store.commit('oPTranstionFalse')
//          this.isActive = !this.isActive;
//          this.isRotateInDownRight = !this.isRotateInDownRight
        },10)
      }
    },
    methods:{
      //退出
      Quit(){
        this.$router.push({ name: 'Login' })
      },
      //用户信息
      getUser(){
        this.$router.push({ name: 'HotelUser' })
      },
      //初始化数据
      initData(){
        this.$store.commit('showLoading');
        //获取所有用户信息
        POST('http://114.55.248.116:3333/HotelService.asmx/GetHotelList',{
          HotelID:'',
          HotelName:'',
          HotelTypeID:'',
          HotelPhone:'',
          HotelTel:'',
          HotelTimeFrom:'',
          HotelTimeTo:'',
          PageNum:1,
          Rows:50
        },(data)=>{
          var data = JSON.parse(data);
          IsBackCode(data,this)
          if(data.backCode==200){
            this.$store.commit('initHotelAllList',data.hotelList)
          }
        })
        //酒店类型
        POST('http://114.55.248.116:3333/HotelService.asmx/GetHotelTypeList',{
          HotelTypeID:'',
          HotelTypeName:'',
          CreatedTimeFrom:'',
          CreatedTimeTo:'',
          Delete:'',
          Page:1,
          Rows:500
        },(data)=>{
          var data = JSON.parse(data);
          IsBackCode(data,this)
          this.$store.commit('initHotelTypeTotal',Number(data.total))
          if(data.backCode==200){
            this.$store.commit('initHotelTypeList',data.hotelTypeList)
          }
        })
        //房间类型
        POST('http://114.55.248.116:3333/HotelService.asmx/GetRoomTypeList',{
          condition:'',
          key:''
        },(data)=>{
          var data = JSON.parse(data);
          IsBackCode(data,this)
          if(data.backCode==200){
            this.$store.commit('initRoomTypeList',data.ht_RoomType)
          }
        })
        //床铺类型
        POST('http://114.55.248.116:3333/HotelService.asmx/GetBedTypeList',{
          condition:'',
          key:''
        },(data)=>{
          var data = JSON.parse(data);
          IsBackCode(data,this)
          if(data.backCode==200){
            this.$store.commit('hideLoading');
            this.$store.commit('initBedTypeList',data.ht_BedType)
          }
        })
      }
    }
  }
</script>
<style scoped>

</style>
