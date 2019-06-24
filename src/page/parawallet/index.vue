<template>
    <div class="paraboxWallet">
      <v-header :title="title"></v-header>
      <div class="paraboxWallet-ct">
        <div class="paraboxWallet-userIcon">
          <img v-if="userIcon && userIcon !==''" :src="userIcon"  style="width:100%;border-radius: 50%;"/>
        </div>
        <p class="paraboxWallet-address" >{{address}}</p>
        <p class="paraboxWallet-balance" >PAD余额: {{balance}}</p>
        <div class="paraboxWallet-bt">
          <p class="delete-button" style="margin-bottom:20px;" @click="toHome">游戏首页</p>
          <p class="paraboxWallet-button" @click="signOut">退出登录</p>
        </div>
      </div>

    </div>
</template>

<script>
  import vHeader from '../../common/components/header';
  import blockies from '../../common/js/blockies.js';
  import { bigNumberNumFloorTo4 } from '../../common/js/bignumber.js';
  import { getStorage, deleteItem } from '../../common/js/storage.js';
  import sdk from '../../common/js/cita.js';
  import { Dialog } from 'vant';
	export default {
    components:{
      vHeader
    },
    data(){
      return {
        userIcon:'',
        balance: '',
        address: '',
        title:'我的钱包'
      }
    },
    mounted(){
      let walletStringify = getStorage('ticketKeystore');
      if(walletStringify && walletStringify !== '') {
        let wallet = JSON.parse(walletStringify);
        let address = wallet.address;
        this.address = address;
      }
      // if (address && address !== '') {
      //   this.address = address;
      // }
      let icon = blockies.create({ seed:this.address ,size: 8,scale: 16}).toDataURL();
      if (icon && icon !== '') {
        this.userIcon = icon;
      }
      let userBalance = sdk.base.getBalance(this.address).then((res) => {
        if (res && res !== '') {
          this.balance = bigNumberNumFloorTo4(res);
        }
      })
    },
    methods:{
      toHome:function(){
        this.$router.replace({path:'/'});
      },
      signOut:function(){
        Dialog.confirm({
          title: '确认退出?',
          // message: '确认退出?'
        }).then(() => {
          deleteItem('ticketKeystore');
          deleteItem('flag');
          // this.balance = 0;
          this.$router.replace({path:'/'});
          // on confirm 清除 localStorage 中的flag和address
        }).catch(() => {
          // on cancel
        });
      }
    }
	}
</script>

<style lang="less" scoped>
    @import '../../common/less/mixin.less';
    .paraboxWallet {
      width:100%;
      height: 100%;
      .paraboxWallet-ct {
        width:100%;
        height: calc(100% - 50px);
        padding-top:40px;
        position: relative;
        box-sizing: border-box;
        min-height: 500px;
        color: #585858;
        .paraboxWallet-userIcon {
          width: 44px;
          height: 44px;
          margin: 0 auto 11px;
        }
        .paraboxWallet-address {
          margin: 0 auto 27px;
          font-size: 12px;
          line-height: 16px;
          text-align: center;
        }
        .paraboxWallet-balance {
          margin: 0 auto;
          font-size: 16px;
          line-height: 21px;
          text-align: center;
        }
        .paraboxWallet-bt {
          position: absolute;
          width:100%;
          bottom:40px;
          left:0;
          .paraboxWallet-button {
            .com-green-button;
          }
          .delete-button {
            .com-green-button;
          }
        }
      }
    }
</style>
