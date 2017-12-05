/**
 * Created by leibo on 17/11/11.
 */
import getters from './getters';
import {POST} from '../assets/js/public'

const state = {
  //所有用户
  useAll:[],
  //loading加载动画
  loadingShow:false,
  //初始化动画
  transtionActive:{
    isActive:false,
    isRotateInDownRight:false
  },
  user:{},//登录用户信息
  HotelTypeList:[],//初始化酒店类型
  HotelTypeListKeyword:[],
  hotelTypeTotal:0,
  //初始化修改数据
  initUpdateHotelTypeObj:{},
  //初始化商户信息
  hotelUsers:[],
  hotelUsersKeyword:[],
  initUpdateObj:{},//初始化修改商户信息
  RoomTypeList:[],//房间类型
  RoomTypeListKeyword:[],
  UpdateRoomType:{},//初始化修改房间类型
  BedTypeList:[],//初始化床铺类型
  BedTypeListKeyword:[],
  initUpdateBedType:{},//初始化修改床铺
  RoomList:[],//房间信息
  RoomListKeyword:[],
  Test:[],//测试
  RoomObj:{},//房间修改初始化
  HotelBedList:[],//床铺订单信息
  UpdateRoom:{},//初始化修改床铺
  HotelOrderList:[],//酒店订单信息
  updateOrderObj:{},//初始化修改订单
};

const mutations = {
  //清空
  clearAll(state){
    state.hotelUsers = state.hotelUsersKeyword = state.RoomList = state.RoomListKeyword = state.HotelOrderList = [];
  },
  //获取所有用户
  initHotelAllList(state,data){
    state.useAll = data
  },
  //测试
  setTest(state,data){
    state.Test = data;
  },
  //loading动画过渡
  showLoading(state){
    state.loadingShow = true
  },
  hideLoading(){
    state.loadingShow = false
  },
  //初始化动画
  setTranstionFalse(state){
    state.transtionActive = {
      isActive:false,
      isRotateInDownRight:false
    }
  },
  oPTranstionFalse(){
    state.transtionActive = {
      isActive:!state.transtionActive.isActive,
      isRotateInDownRight:!state.transtionActive.isRotateInDownRight
    }
  },
  //初始化酒店类型总条数
  initHotelTypeTotal(state,num){
    state.hotelTypeTotal = num
  },
  //初始化登录信息
  setUser(state,user){
    state.user = user;
  },
  //初始化酒店类型
  initHotelTypeList(state,data){
    state.HotelTypeList = data;
    state.HotelTypeListKeyword = data
  },
  //设置酒店类型分页
  setHotelTypeTotal(state,num){
    state.hotelTypeTotal = num;
  },
  //筛选
  searchHotelType(state,keyword){
    state.HotelTypeListKeyword = state.HotelTypeList.filter(item=>{
      var str = item.htt_HotelTypeName;
      if(str.includes(keyword)){
        return true;
      }
      return false;
    })
  },
  //初始化修改数据
  setInitObj(state,id){
    state.initUpdateHotelTypeObj = state.HotelTypeListKeyword.filter(item=>{
      if(item.htt_HotelTypeID==id){
        return true;
      }
      return false;
    })[0]
  },
  //删除酒店类型
  filterHotelType(state,id){
    state.HotelTypeListKeyword = state.HotelTypeListKeyword.map(item=>{
      if(item.htt_HotelTypeID==id){
        item.htt_IsDelete = 1;
        return item;
      }
      return item;
    })
  },
  //初始化商户信息
  setInitHotelUsers(state,users){
    for(var i=0;i<users.length;i++){
      state.HotelTypeListKeyword.forEach(item=>{
        if(users[i].ht_HotelTypeID==item.htt_HotelTypeID){
          users[i].HotelTypeName = item.htt_HotelTypeName
        }
      })
    }
    state.hotelUsers = users;
    state.hotelUsersKeyword = users;
  },
  //初始化修改数据
  setInitUpdateObj(state,id){
    state.initUpdateObj = state.hotelUsersKeyword.filter(item=>{
      if(item.ht_HotelID==id){
        return true
      }
      return false
    })[0]
  },
  //删除商户
  filterHotelUser(state,id){
    state.hotelUsersKeyword = state.hotelUsersKeyword.map(item=>{
      if(item.ht_HotelID==id){
        item.ht_IsDelete = 1;
        return item;
      }
      return item;
    })
  },
  //初始化房间类型
  initRoomTypeList(state,data){
    state.RoomTypeList = data;
    state.RoomTypeListKeyword = data;
  },
  //初始化修改房间类型
  initUpdateRoomType(state,id){
    state.UpdateRoomType = state.RoomTypeListKeyword.filter(item=>{
      if(item.rt_RoomTypeID==id){
        return true
      }
      return false;
    })[0]
  },
  //删除房间类型
  filterRoomType(state,id){
    state.RoomTypeListKeyword = state.RoomTypeListKeyword.filter(item=>{
      if(item.rt_RoomTypeID==id){
        return false;
      }
      return true;
    })
  },
  //初始化床铺类型
  initBedTypeList(state,data){
    state.BedTypeListKeyword = data;
    state.BedTypeList = data;
  },
  //初始化修改床铺类型
  initUpdateBedType(state,id){
    state.initUpdateBedType = state.BedTypeListKeyword.filter(item=>{
      if(item.bt_BedTypeID==id){
        return true;
      }
      return false;
    })[0]
  },
  //删除床铺类型
  filterBedType(state,id){
    state.BedTypeListKeyword = state.BedTypeListKeyword.filter(item=>{
      if(item.bt_BedTypeID==id){
        return false;
      }
      return true;
    })
  },
  //初始化房间信息
  initRoomList(state,data){
    state.RoomListKeyword = data;
    state.RoomList = data;
  },
  //删除房间
  filterRoom(state,id){
    state.RoomListKeyword = state.RoomListKeyword.filter(item=>{
      if(item.rm_RoomID==id){
        item.rm_IsDelete = 1;
        return item;
      }
      return item;
    })
  },
  //初始化修改房间
  setInitRoomObj(state,id){
    state.RoomObj = state.RoomListKeyword.filter(item=>{
      if(item.rm_RoomID==id){
        return true
      }
      return false
    })[0];
  },
  //初始化床铺订单信息
  initHotelBedList(state,data){
    for(var i=0;i<data.length;i++){
      state.BedTypeListKeyword.forEach(item=>{
        if(data[i].b_BedTypeID==item.bt_BedTypeID){
          data[i].b_BedTypeName = item.bt_BedTypeName
        }else{
          data[i].b_BedTypeName = '';
        }
      })
    }
    for(var i=0;i<data.length;i++){
      state.useAll.forEach(item=>{
        if(data[i].b_BedTypeID==item.bt_BedTypeID){
          data[i].b_BedTypeName = item.bt_BedTypeName
        }else{
          data[i].b_BedTypeName = '';
        }
      })
    }
    state.HotelBedList = data;
  },
  //删除床铺
  filterHotelBed(state,id){
    state.HotelBedList = state.HotelBedList.filter(item=>{
      if(item.b_BedID==id){
        item.b_IsDelete = 1;
        return item;
      }
      return item;
    })
  },
  //初始化修改床铺
  setUpdateRoom(state,id){
    state.UpdateRoom = state.HotelBedList.filter(item=>{
      if(item.b_BedID==id){
        return true
      }
      return false
    })[0]
  },
  //酒店订单信息
  initHotelOrder(state,data){
    state.HotelOrderList = data;
  },
  //修改订单初始化
  setHotelOrderObj(state,id){
    state.updateOrderObj = state.HotelOrderList.filter(item=>{
      if(item.ho_OrderId==id){
        return true
      }
      return false
    })[0]
  },
  //删除订单
  filterHotelOrder(state,id){
    state.HotelOrderList = state.HotelOrderList.map(item=>{
      if(item.ho_OrderId==id){
        item.ho_IsDelete = 1;
        return item
      }
      return item;
    })
  }
};

export default {
  getters,
  state,
  mutations
}
