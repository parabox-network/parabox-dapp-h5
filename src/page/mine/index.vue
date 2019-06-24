<template>
    <div class="mine">
      <v-header :title="title"></v-header>
      <div class="mine-main">
        <img class="mine-main-img" :src="wallet.source" alt="" />
        <p class="mine-main-addr">{{wallet.address}}</p>
        <p class="mine-main-bal">{{unit}}余额：{{wallet.balance}}</p>
        <div class="mine-delete">
          <p class="delete-button" style="margin-bottom:20px;" @click="toHome">游戏首页</p>
          <p class="delete-button" @click="deleteWallet">删除钱包</p>
        </div>
      </div>
    </div>
</template>

<script>
  import vHeader from '../../common/components/header';
  import { getStorage,deleteItem } from '../../common/js/storage';
  import blockies from '../../common/js/blockies.js';
  import { bigNumberNum } from '../../common/js/bignumber';
  import cita from '../../common/js/cita';
  import {Dialog} from 'vant';
	export default {
    components:{
      vHeader,
      [Dialog.name]:Dialog
    },
    data(){
      return {
        title:'我的钱包',
        wallet:''
      }
    },
    mounted(){
      this.getWallet();
    },
    methods:{
      toHome:function(){
        this.$router.push({path:'/'});
      },
      getWallet:function(){
        let ticketWallet = getStorage('ticketKeystore');
        if(ticketWallet && ticketWallet !== '') {
          ticketWallet = JSON.parse(ticketWallet);
          ticketWallet.source = blockies.create({ seed:ticketWallet.address ,size: 8,scale: 16}).toDataURL()
          cita.base.getBalance(ticketWallet.address).then((bal)=>{
             ticketWallet.balance = bigNumberNum(bal);
             this.wallet = ticketWallet;
          })
        }
      },
      deleteWallet:function(){
        Dialog.confirm({
          message: '确认删除该钱包?'
        }).then(() => {
          deleteItem('ticketKeystore');
          this.$router.push({path:'/'});
          // on confirm
        }).catch(() => {
          // on cancel
        });
      }
    }
	}
</script>

<style lang="less" scoped>
    @import '../../common/less/mixin.less';
    .mine {
      width:100%;
      height:100%;
      .mine-main {
        width:250px;
        margin:40px auto 0;
        .mine-main-img {
          width:44px;
          height:44px;
          border-radius: 22px;
          background-color: #ddd;
          display: block;
          margin: 0 auto;
        }
        .mine-main-addr {
          margin-top:15px;
          word-break: break-all;
          color:#585858;
          font-size: 12px;
          line-height: 16px;
          text-align: center;
        }
        .mine-main-bal {
          margin-top:25px;
          width:100%;
          text-align: center;
          color:#585858;
          font-size: 16px;
          line-height: 21px;
          word-break: break-all;
        }
        .mine-delete {
          position: absolute;
          bottom:40px;
          left:0;
          width:100%;
          .delete-button {
            .com-green-button;
          }
        }
      }
    }
</style>
