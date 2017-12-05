<template>
  <el-autocomplete
    v-model="state4"
    :fetch-suggestions="querySearchAsync"
    placeholder="请输入内容"
    @select="handleSelect"
    ></el-autocomplete>
</template>
<script>
  //输入搜索数据
  import {POST,IsBackCode} from '../assets/js/public'
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        restaurants: [],
        state4: '',
        timeout: null
      };
    },
    computed:mapGetters([
    ]),
    methods: {
      loadList(name) {
        return new Promise(function (relove,reject) {
          POST('http://114.55.248.116:3333/HotelService.asmx/GetHotelList',{
            HotelID:'',
            HotelName:name==''?'龙门':name,
            HotelTypeID:'',
            HotelPhone:'',
            HotelTel:'',
            HotelTimeFrom:'',
            HotelTimeTo:'',
            PageNum:1,
            Rows:30
          },
          data=>{
              var data = JSON.parse(data);
            console.log(data)
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
          data.hotelList = data.hotelList.map(item=>{
            return {
              id:item.ht_HotelID,
              value:item.ht_HotelName
            }
          })
          this.restaurants = data.hotelList;
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(this.restaurants);
          }, 1000 * Math.random());
        })
      },
      handleSelect(item) {
        this.state4 = item.id
        console.log(item,this.state4);
      }
    },
    mounted() {

//      this.restaurants = this.Test;
//      console.log(this.restaurants)
    }
  };
</script>
