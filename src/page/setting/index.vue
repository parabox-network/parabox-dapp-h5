<template>
    <div class="setting">
      <v-header :title="title"></v-header>
      <div class="setting-ct">
        <van-field
          v-model="password"
          placeholder="输入密码"
          class="setting-name"
          type="password"
        />
        <van-field
          v-model="repeat"
          placeholder="再次输入密码"
          class="setting-name"
          type="password"
        />
        <div class="setting-bt">
          <p class="setting-button" @click="create">完成导入</p>
        </div>
      </div>

    </div>
</template>

<script>
  import vHeader from '../../common/components/header';
  import {getPrivateKeyFromMnemonic} from '../../common/js/Mnemonic';
  import {createAccount} from '../../common/js/Keythereum';
  import {setStorage} from '../../common/js/storage';
  import { Field,Toast, Dialog } from 'vant';

	export default {
    components:{
      vHeader,
      [Field.name]:Field,
      [Toast.name]:Toast,
      [Dialog.name]:Dialog
    },
    data(){
      return {
        password:'',
        repeat:'',
        title:'导入钱包',
        // privateKey:'',
        timer:'',
      }
    },
    mounted() {
    },
    beforeDestroy() {
      clearTimeout(this.timer);
    },
    methods:{
      create:function(){
        if(!this.password || this.password === '' || this.password.length < 6) {
          Toast("钱包密码不能为空且不下于6位！");
          return;
        }
        if(!this.repeat || this.repeat === '') {
          Toast("请重复钱包密码！");
          return;
        }
        if(this.password !== this.repeat) {
          Toast("钱包密码不一致！");
          return;
        }
        Toast.loading({
          mask: true,
          message: '导入中...',
          duration:0
        });
        this.timer = setTimeout(this.createAccount,1000);
      },
      createAccount:function() {
        let that = this;
        clearTimeout(that.timer);
        let verifyPhrase = atob(that.$route.query.verifyPhrase.replace(/%253D/g, "="));
        let privateKey = getPrivateKeyFromMnemonic(verifyPhrase);
        console.log(privateKey);
        createAccount(that.password, privateKey).then(function (res) {
          res.address = "0x"+res.address;
          Toast('钱包添加完成！');
          console.log(res);
          setStorage("ticketKeystore",JSON.stringify(res));
          that.$router.push({path:'/mine'});

        }).catch((err)=>{
            Toast(err.message);
        })
      }
    }
	}
</script>

<style lang="less" scoped>
    @import '../../common/less/mixin.less';
    .setting {
      width:100%;
      height: 100%;
      position: relative;
      .setting-ct {
        width:100%;
        // overflow-y: auto;
        padding-top:50px;
        height: calc(100% - 50px);
        position: relative;
        box-sizing: border-box;
        min-height: 500px;
        .setting-name {
          width:300px;
          background:rgba(255,255,255,1);
          border:1px solid rgba(196,196,196,1);
          opacity:1;
          border-radius:4px;
          line-height: 16px;
          padding:12px 10px;
          margin: 0 auto 20px;
          font-size: 12px;
          color:#b8b8b8;
        }
        .setting-bt {
          position: absolute;
          width:100%;
          bottom:40px;
          left:0;
          .setting-button {
            .com-green-button;
          }
        }
      }


    }
</style>
