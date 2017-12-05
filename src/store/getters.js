/**
 * Created by leibo on 17/11/11.
 */
export default {
  //所有用户
  useAll(state){
    return state.useAll
  },
  loadingShow(state){
    return state.loadingShow
  },
  //初始化动画
  transtionActive(state){
    return state.transtionActive
  },
  user(state){
    return state.user
  },
  //初始化酒店类型
  HotelTypeList(state){
    return state.HotelTypeList;
  },
  HotelTypeListKeyword(state){
    return state.HotelTypeListKeyword;
  },
  hotelTypeTotal(state){
    return state.hotelTypeTotal
  },
  initUpdateHotelTypeObj(state){
    return state.initUpdateHotelTypeObj;
  },
  //初始化商户信息
  hotelUsers(state){
    return state.hotelUsers;
  },
  hotelUsersKeyword(state){
    return state.hotelUsersKeyword;
  },
  //初始化修改数据
  initUpdateObj(state){
    return state.initUpdateObj
  },
  //初始化房间类型总条数
  roomTypeTotal(state){
    return state.roomTypeTotal
  },
  //初始化房间类型
  RoomTypeList(state){
    return state.RoomTypeList
  },
  RoomTypeListKeyword(state){
    return state.RoomTypeListKeyword;
  },
  //初始化修改房间类型
  initUpdateRoomType(state){
    return state.UpdateRoomType
  },
  //初始化床铺类型
  BedTypeListKeyword(state){
    return state.BedTypeListKeyword;
  },
  BedTypeList(state){
    return state.BedTypeList;
  },
  //初始化修改床铺
  initUpdateBedType(state){
    return state.initUpdateBedType
  },
  //房间信息
  RoomListKeyword(state){
    return state.RoomListKeyword
  },
  //测试
  Test(state){
    return state.Test
  },
  //初始化房间修改
  RoomObj(state){
    return state.RoomObj;
  },
  //初始化床铺订单信息
  HotelBedList(state){
    return state.HotelBedList;
  },
  //初始化修改床铺
  UpdateRoom(state){
    return state.UpdateRoom
  },
  //酒店订单
  HotelOrderList(state){
    return state.HotelOrderList
  },
  //初始化酒店修改订单
  updateOrderObj(state){
    return state.updateOrderObj
  }
}

