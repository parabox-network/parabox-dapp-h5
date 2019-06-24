<template>
    <div class="rule">
        <v-header :title="title"></v-header>
        <div class="rule-main">
          <p class="rule-title">"16选6"彩票规则</p>
          <div class="rule-item">
            <p class="tips">玩法规则</p>
            <p class="desc">1. 玩家从0–15中间选出6个数按顺序排列, 例如: 4, 15, 9, 5, 0, 13. <br/> 2. 选完数字后设置投注金额, 投注金额的上下限值由合约管理员设定, 可通过合约查询. <br/> 3. 全部设置完成后提交订单, 交易发送至合约, 合约随机生成中奖号码, 返回中奖结果. <br/> 4. 玩家中奖后, 奖金自动转入本人支付时使用的钱包地址. <br/> 5. 投注号码需要满足“数字和位置”两个条件才算猜中。</p>
          </div>
          <div class="rule-item">
            <p class="tips">奖金设置</p>
            <p class="desc">一等奖, 猜中6个数 : 投注金额 * 5000000 <br/> 二等奖, 猜中5个数 : 投注金额 * 20000 <br/> 三等奖, 猜中4个数 : 投注金额 * 500 <br/> 四等奖, 猜中3个数 : 投注金额 * 25 <br/> 五等奖, 猜中2个数 : 投注金额 * 3 <br/> 六等奖, 猜中1个数 : 投注金额 * 0.5</p>
          </div>
          <div class="rule-item">
            <p class="tips">特殊情况</p>
            <p class="desc">当用户中奖金额超过奖池总额 ( 合约余额 ) 时, 该用户实际可获得奖金为奖池总额的全部余额.</p>
          </div>
        </div>
    </div>
</template>

<script>
  import vHeader from '../../common/components/header';
  export default {
    components:{
      vHeader
    },
    data(){
      return {
        title:'游戏规则',
      }
    },
    methods:{
    }
  }
</script>

<style lang="less" scoped>
  .rule {
    width:100%;

    .rule-main {
      padding:10px 23px;
      width:100%;
      box-sizing: border-box;

      .rule-title {
        font-size: 16px;
        line-height: 21px;
        color:#2491e4;
        font-weight: bold;
        margin:7px 0 25px 1px;
        letter-spacing: 1px;
      }

      .rule-item {
        width: 100%;
        margin-bottom:25px;
        letter-spacing: 1px;

        .tips {
          font-size: 12px;
          line-height: 16px;
          color:#585858;
          font-weight: bold;
          margin-bottom:5px;
        }

        .desc {
          font-size: 12px;
          line-height: 16px;
          color:#858585;

        }
      }

    }
  }
</style>
