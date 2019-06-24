<template>
  <div class="wallet">
    <v-header :title="title"></v-header>
    <div class="wallet-main">
      <p class="wallet-button" @click="mnemonic">导入助记词</p>
      <p class="wallet-button" @click="keystore">导入keystore</p>
      <p class="wallet-button" @click="paraboxWallet">使用 Parabox 钱包登录</p>
    </div>
  </div>
</template>

<script>
  import vHeader from '../../common/components/header';
  import { setStorage } from '../../common/js/storage.js';
  import { Toast } from 'vant';
	export default {
    components:{
      vHeader,
      [Toast.name]:Toast
    },
		data() {
			return {
        title:'导入钱包',
        wallet: {}
			}
    },
		mounted() {

    },
		methods:{
      mnemonic:function(){
        this.$router.push({path:'/mnemonic'});
      },
      keystore:function(){
        this.$router.push({path:'/keystore'});
      },
      paraboxWallet: function(){
        if (window.paraboxWallet) {
          window.paraboxWallet.getCurrentAccount().then((address) => {
            this.wallet.address = address;
            setStorage('ticketKeystore', JSON.stringify(this.wallet));
            setStorage('flag', true);
            this.$router.replace({path:'/paraWallet'});
          }).catch(err => {
            Toast(err);
          })
        } else {
          Toast('请前往App进行授权');
        }
		  }
    }
  }
</script>

<style lang="less" scoped>
	@import '../../common/less/mixin.less';
	.wallet {
		width:100%;
    .wallet-main {
      width:100%;
      margin-top:95px;
      .wallet-button {
        width:255px;
        height:44px;
        background-color:#358CEF;
        border-radius:8px;
        line-height: 44px;
        text-align: center;
        color:#fff;
        font-size: 14px;
        margin:0 auto 36px;
        letter-spacing: 1px;
      }
    }
  }

</style>
