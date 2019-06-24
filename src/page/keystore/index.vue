<template>
    <div class="verifyMnemonic">
      <v-header :title="title"></v-header>
      <div class="verifyMnemonic-ct">
        <van-field
          v-model="keystore"
          type="textarea"
          placeholder="请输入Keystore"
          class="verifyMnemonic-area"
          rows="6"
          autosize
        />
        <van-field
          v-model="password"
          placeholder="输入Keystore生成密码"
          class="setting-name"
          type="password"
        />
        <div class="verifyMnemonic-bt">
          <p class="verifyMnemonic-button" @click="verifyPass">完成导入</p>
        </div>
      </div>

    </div>
</template>

<script>
  import vHeader from '../../common/components/header';
  import { Field,Toast } from 'vant';
  import {setStorage} from '../../common/js/storage';
  import {getPrivateKey,createAccount} from '../../common/js/Keythereum';
	export default {
    components:{
      vHeader,
      [Field.name]:Field,
      [Toast.name]:Toast
    },
    data(){
      return {
        keystore:'',
        title:'Keystore',
        password:'',
        timer:''
      }
    },
    mounted(){
    },
    beforeDestroy() {
      clearTimeout(this.timer);
    },
    methods:{
      verifyPass:function(){
        if(!this.keystore || this.keystore === '') {
          Toast("Keystore不能为空！");
          return;
        }
        if(!this.password || this.password === '') {
          Toast("Keystore生成密码不能为空！");
          return;
        }
        Toast.loading({
          mask: true,
          message: '导入中...',
          duration:0
        });
        this.timer = setTimeout(this.keystoreCreate,1000);
      },
      async keystoreCreate(){
        try {
          let that = this;
          let keyStore = that.keystore;
          let data = {
              password: that.password,
              keyStore: JSON.parse(keyStore)
          }
          let key = await getPrivateKey(data);
          console.log(key);
          createAccount(that.password, key).then(function (res) {
            res.address = "0x"+res.address;
            Toast('钱包添加完成！');
            console.log(res);
            setStorage("ticketKeystore",JSON.stringify(res));
            that.$router.push({path:'/mine'});
          }).catch((err)=>{
              Toast(err.message);
          })
        } catch (error) {
          Toast(error.message);
        }

      }
    }
	}
</script>

<style lang="less" scoped>
    @import '../../common/less/mixin.less';
    .verifyMnemonic {
      width:100%;
      height: 100%;
      position: relative;
      .verifyMnemonic-ct {
        width:100%;
        // overflow-y: auto;
        height: calc(100% - 50px);
        padding-top:64px;
        position: relative;
        box-sizing: border-box;
        min-height: 500px;
        .verifyMnemonic-area {
          width:293px;
          background:rgba(242,242,242,1);
          border:1px solid rgba(201,201,201,1);
          opacity:1;
          border-radius:4px;
          margin:0 auto 0;
          font-size: 13px;
          line-height: 17px;
          margin-bottom: 20px;
        }
        .setting-name {
          width:293px;
          background:rgba(255,255,255,1);
          border:1px solid rgba(196,196,196,1);
          opacity:1;
          border-radius:4px;
          line-height: 16px;
          padding:8px 10px;
          margin: 0 auto 20px;
          font-size: 12px;
          color:#b8b8b8;
        }
        .verifyMnemonic-bt {
          position: absolute;
          width:100%;
          bottom:40px;
          left:0;
          .verifyMnemonic-button {
            .com-green-button;
          }
        }
      }

    }
</style>
