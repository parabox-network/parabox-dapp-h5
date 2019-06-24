<template>
    <div class="header">
        <!-- <van-icon v-show="!back || back === false" name="arrow-left" size="24px" class="left-icon" @click="backRoute()" /> -->
        <p class="header-title">{{title}}</p>
        <div class="right-icon">
          <span v-if="rightText && rightText !== ''" style="font-size:12px;color:#358cef;line-height: 30px;" @click="showAction()">{{rightText}}</span>
          <div v-else-if="type && type ==='icon'" class="right-bg-ic">
            <img v-if="wallet && wallet !==''" :src="wallet.source" style="width:100%;" @click="showAction()" />
            <van-icon v-else name="manager-o" color="#fff" size="20px" style="margin-top:5px;" @click="showAction()" />
          </div>
          <span v-else></span>
        </div>
        <van-actionsheet
          v-model="show"
          :actions="rightArray"
          @select="onSelect"
        />
    </div>
</template>

<script>
  import {getStorage} from '../../common/js/storage.js';
  import blockies from '../../common/js/blockies.js';
  export default {
    props:{
      title:{
        type:String,
      },
      rightText:{
        type:String,
      },
      rightArray:{
        type:Array,
      },
      type:{
        type:String
      },
      back:{
        type:Boolean
      }
    },
    data() {
      return {
        show: false,
        wallet:''
      }
    },
    mounted(){
      let ticketWallet = getStorage('ticketKeystore');
      if(ticketWallet && ticketWallet !== '') {
        ticketWallet = JSON.parse(ticketWallet);
        ticketWallet.source = blockies.create({ seed:ticketWallet.address ,size: 8,scale: 16}).toDataURL()
        this.wallet = ticketWallet;
      }
    },
    methods: {
      backRoute() {
        this.$router.go(-1);
      },
      onSelect(item) {
        // 点击选项时默认不会关闭菜单，可以手动关闭

        switch(item.type) {
          case 0:
          case 1:
          case -1:
            this.$emit("toParentStatus",item.type);
            break;
          case "rule":
          case "bet":
          case "wallet":
          case "paraWallet":
            this.$router.push({path:'/'+item.type});
            break;
          default:
            break;
        }
        this.show = false;
      },
      showAction(){
        this.show = true;
      }
    }

  }
</script>

<style lang="less" scoped>
  @import '../../common/less/mixin.less';
  .header {
    .border-btm(#f9f9f9);
    top:0;
    left:0;
    width:100%;
    height:50px;
    line-height: 50px;
    text-align: center;
    background-color: #f9f9f9;
    .left-icon {
      position: absolute;
      left:10px;
      top:13px;
      color:#585858;
    }

    .right-icon {
      position: absolute;
      right:15px;
      top:8px;
      color:#585858;
      line-height: 24px;
      .right-bg-ic {
        width:32px;
        height:32px;
        border-radius: 16px;
        background-color: #9373EC;
        display: inline-block;
        vertical-align: middle;
        overflow: hidden;
      }
    }

    .header-title {
      color:#000;
      font-size: 17px;
      font-weight: bold;
      letter-spacing: 1px;
    }
  }
</style>
