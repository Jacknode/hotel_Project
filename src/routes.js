/**
 * Created by leibo on 17/11/9.
 */
import Login from './components/Login' //登录
import NotFound from './components/NotFound'
import Home from './components/Home' //首页
import Demo_01 from './components/Demo_01'
import HotelType from './components/HotelType' //酒店类型
import HotelUser from './components/HotelUser' //酒店商户信息
import RoomType from './components/RoomType'  //房间类型
import BedType from './components/BedType' //床铺类型
import RoomInformation from './components/RoomInformation' //房间信息
import BedInformation from './components/BedInformation' //床铺信息
import HotelOrder from './components/HotelOrder' //酒店订单信息
export default [
  {
    path: '/login',
    component: Login,
    name: 'Login',
    hidden: true
  },
  {
    path: '/',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: 'NotFound',
    hidden: true
  },
  {
    path:'/home',
    name:'Home',
    components:{
      default:Home
    },
    children:[
      {
        path: 'demo',
        components: {
          default: Home,
          User: Demo_01
        },
        name:'Demo_01'
      },
      {
        path: 'hotelUser',
        components: {
          default: Home,
          User: HotelUser
        },
        name:'HotelUser'
      },
      {
        path: 'hotelType',
        components: {
          default: Home,
          User: HotelType
        },
        name:'HotelType'
      },
      {
        path: 'roomType',
        components: {
          default: Home,
          User: RoomType
        },
        name:'RoomType'
      },
      {
        path: 'bedType',
        components: {
          default: Home,
          User: BedType
        },
        name:'BedType'
      },
      {
        path: 'roomInformation',
        components: {
          default: Home,
          User: RoomInformation
        },
        name:'RoomInformation'
      },
      {
        path: 'bedInformation',
        components: {
          default: Home,
          User: BedInformation
        },
        name:'BedInformation'
      },
      {
        path: 'hotelOrder',
        components: {
          default: Home,
          User: HotelOrder
        },
        name:'HotelOrder'
      }
    ],
  },
  {
    path: '*',
    hidden: true,
    redirect: { path: '/login' }
  }
]
