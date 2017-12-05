<template>
  <div id="wrap"  class="animated rotateInDownLeft">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {POST} from '../assets/js/public'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '000',
          checkPass: '123'
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this.logining = true;
            var loginParams = { HotelID: this.ruleForm2.account, Password: this.ruleForm2.checkPass };
            POST('http://114.55.248.116:3333/HotelService.asmx/LoginHotel',loginParams,(data)=>{
              this.logining = false;
              var data = JSON.parse(data)
              console.log(data)
              if(data.backCode==200){
                sessionStorage.setItem('admin',data.hotel.ht_HotelName);
                sessionStorage.setItem('isLogin','true');
                this.$store.commit('setUser',data.hotel)
                this.$router.push({name:'HotelUser'});
                window.location.reload()
              }else{
                this.$message({
                  message: data.backResult,
                  type: 'error'
                });
              }
//              if(Number(data.backCode)===200){
//                sessionStorage.setItem('user', JSON.stringify(loginParams.username));
//                this.$router.push({ path: '/home' });
//              }else{
//                this.$message({
//                  message: data.result,
//                  type: 'error'
//                });
//              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  #wrap {
    padding-top: 150px;
    /*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
    width: 100%;
    height: 100%;
    background: url("../assets/img/bg.jpeg") no-repeat !important;
    background-size: 100%;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    font-size: 14px;
  }
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
  }
</style>
