<template>
<div class="game">
    <!-- <v-header style="position:fixed;z-index:999;" :title="title" :type="type" :back="backState" :rightArray="rightArray"></v-header> -->
    <van-pull-refresh class="game-pull" v-model="isLoading" @refresh="onRefresh">
      <div class="game-top">
          <p class="game-pool">奖池金额:{{balance}} {{unit}}</p>
          <ul class="game-ul">
              <li v-for="(item,index) in initNumber" :key="index" @click="addNumber(item,index)">
                  <!-- <p :class="[item.state && item.state === true ? 'active':'']">{{item.value}}</p> -->
                  <van-button class="van-button" plain round type="danger">{{item.value}}</van-button>

              </li>
          </ul>
          <div class="right-bg-ic" v-if="wallet && wallet !==''">
            <img :src="wallet.source" style="width:100%;" @click="showAction()" />
            <!-- <van-icon v-else name="manager-o" color="#fff" size="20px" style="margin-top:5px;" @click="showAction()" /> -->
          </div>
          <p class="right-text-ic" v-else @click="showAction()">登录</p>
      </div>
      <div class="game-bottom">
          <div class="game-mine">
              <p class="game-mine-left">我的选号</p>
              <p class="game-mine-right" @click="robot()">机选</p>
          </div>
          <ul class="game-number">
              <li v-for="(item,index) in chooseNumber" :key="index" @click="deleteNumber(index)">
                  <p v-if="item !== ''" class="active">{{item}}</p>
                  <p v-else>{{item}}</p>
              </li>
          </ul>
          <div class="game-amount">
              <van-field class="game-input" type="number" v-model="amount" placeholder="请输入投注金额" />
              <p class="game-unit">{{unit}}</p>
          </div>
          <div class="game-limit">
              <p>投注金额最小{{min}}，最大{{max}}</p>
          </div>
          <div class="game-button" @click="bet()">
              <p>确认投注</p>
          </div>
      </div>
    </van-pull-refresh>
    <van-popup v-model="visible" style="background-color:transparent;overflow-y: hidden;">
        <div class="prize-result">
            <img v-if="level && level === 1" src="../../images/no.1.svg" alt="" style="width:100%;"/>
            <img v-if="level && level === 2" src="../../images/no.2.svg" alt="" style="width:100%;"/>
            <img v-if="level && level === 3" src="../../images/no.3.svg" alt="" style="width:100%;"/>
            <img v-if="level && level === 4" src="../../images/no.4.svg" alt="" style="width:100%;"/>
            <img v-if="level && level === 5" src="../../images/no.5.svg" alt="" style="width:100%;"/>
            <img v-if="level && level === 6" src="../../images/no.6.svg" alt="" style="width:100%;"/>
            <img v-if="level === 0" src="../../images/Failed.svg" alt="" style="width:100%;"/>
      </div>
    </van-popup>
    <van-dialog v-model="sendVisible" :show-confirm-button=false :close-on-click-overlay=true class="game-dialog">
        <div class="dialog-main">
            <p class="dialog-title">总计支付</p>
            <p class="dialog-amount">1000.000PAD</p>
            <div class="dialog-item">
                <p class="dialog-item-left">付款钱包</p>
                <p class="dialog-item-right">{{wallet.address}}</p>
            </div>
            <div class="dialog-item">
                <p class="dialog-item-left">钱包余额</p>
                <p class="dialog-item-right">{{wallet.balance}} {{unit}}</p>
            </div>
            <div class="dialog-item">
                <p class="dialog-item-left">交易金额</p>
                <p class="dialog-item-right">{{amount}} {{unit}}</p>
            </div>
            <div class="dialog-item">
                <p class="dialog-item-left">交易手续费</p>
                <p class="dialog-item-right">{{gas | fromWei}}</p>
            </div>
            <div class="dialog-item">
                <van-field v-model="password" placeholder="请输入钱包密码" class="dialog-item-field" type="password" />
            </div>
            <div class="dialog-item" style="margin-top:10px;">
                <p class="dialog-cancel" @click="dialogCancel">取消</p>
                <p class="dialog-confirm" @click="confirm">确定</p>
            </div>
        </div>
    </van-dialog>
    <van-actionsheet
      v-model="show"
      :actions="rightArray"
      @select="onSelect"
    />
</div>
</template>

<script>
import vHeader from '../../common/components/header';
import Contract from '../../common/contract';
import cita from '../../common/js/cita';
import {bigNumberNum,bigNumberNumFixed} from '../../common/js/bignumber';
import {getPrizeLevel} from '../../api';
import {getStorage,deleteItem} from '../../common/js/storage';
import {signTransaction} from '../../common/js/getSignedData';
// import {log} from 'util';
import blockies from '../../common/js/blockies';
export default {
    components: {
        vHeader
    },
    data() {
        return {
            title: "16选6",
            backState: true,
            show:false,
            initNumber: [{
                    value: "0",
                    state: false
                },
                {
                    value: "1",
                    state: false
                }, {
                    value: "2",
                    state: false
                }, {
                    value: "3",
                    state: false
                }, {
                    value: "4",
                    state: false
                }, {
                    value: "5",
                    state: false
                }, {
                    value: "6",
                    state: false
                }, {
                    value: "7",
                    state: false
                }, {
                    value: "8",
                    state: false
                }, {
                    value: "9",
                    state: false
                }, {
                    value: "10",
                    state: false
                }, {
                    value: "11",
                    state: false
                }, {
                    value: "12",
                    state: false
                }, {
                    value: "13",
                    state: false
                }, {
                    value: "14",
                    state: false
                }, {
                    value: "15",
                    state: false
                }
            ],
            type: 'icon',
            chooseNumber: ['', '', '', '', '', ''],
            amount: '',
            rightArray: [],
            balance: '', //合约余额
            max: '',
            min: '',
            visible: false,
            reaultHash: '',
            level: '',
            wallet: '',
            sendVisible: false,
            gas: 2000000,
            password: '',
            data: '',
            timer: '',
            timerSuc: '',
            flag: '',
            isLoading:false
        }
    },
    mounted() {
        this.initWallet();
        this.getInit();
    },

    beforeDestroy() {
        clearTimeout(this.timer);
        clearTimeout(this.timerSuc);
    },

    filters: {
        fromWei: function (value) {
            if (typeof (value) === 'number') {
                value = value.toString();
            }
            return cita.utils.fromWei(value);
        }
    },

    methods: {
        onRefresh:function() {
          setTimeout(() => {
            this.$toast('刷新成功');
            this.initWallet();
            this.isLoading = false;
          }, 500);
        },
        showAction:function(){
          this.show = true;
        },
        initWallet(){
          let ticketWallet = getStorage('ticketKeystore');

          if (ticketWallet && ticketWallet !== '') {
              ticketWallet = JSON.parse(ticketWallet);
              ticketWallet.source = blockies.create({ seed:ticketWallet.address ,size: 8,scale: 16}).toDataURL()
              this.wallet = ticketWallet;
              cita.base.getBalance(this.wallet.address).then((bal) => {
                  this.wallet.balance = bigNumberNum(bal);
              }).catch(() => {
                  this.$toast("余额获取异常，请刷新重试！");
              })
          }

          let flag = getStorage('flag');
          if (flag && flag !== '') {
            console.log("flog*************"+typeof(flag));
            this.flag = flag
          }

          setTimeout(() => {
            if (window.paraboxWallet && this.flag === "true") {
              if (this.wallet.address) {
                window.paraboxWallet.isCurrentAccount(this.wallet.address).then((res) => {
                  console.log(res);
                  if (!res) {
                    deleteItem('ticketKeystore');
                    deleteItem('flag');
                    window.location.reload();
                  }
                })
              }
            }
          }, 1000);

          this.rightArray = [{
                  name: ticketWallet && ticketWallet !== '' ? '我的钱包' : '添加钱包',
                  type: ticketWallet && ticketWallet !== '' ? 'paraWallet' : 'wallet'
              },
              {
                  name: '我的投注',
                  type: 'bet'
              },
              {
                  name: '游戏规则',
                  type: 'rule'
              }
          ];
        },
        onSelect(item) {
        // 点击选项时默认不会关闭菜单，可以手动关闭

        switch(item.type) {
          case "bet":
            if(this.wallet && this.wallet!=='') {
              this.$router.push({path:'/'+item.type});
            } else {
              this.$toast("请点击登录按钮添加用户钱包！");
            }
            break;
          case "rule":
          case "wallet":
          case "paraWallet":
            this.$router.push({path:'/'+item.type});
            break;
          default:
            break;
        }
        this.show = false;
      },
        getEvent(hash) {
            let that = this;
            let params = {
                parameter: hash,
            }
            getPrizeLevel(params).then((res) => {
                console.log(JSON.stringify(res));
                if (res.code === 200) {
                    if (res.data && res.data.data) {
                        console.log(res.data.data.lotter);
                        let lotter = res.data.data.lotter;
                        that.level = lotter;
                        that.visible = true;
                        this.$toast.clear();
                    } else {
                        this.$toast('投注结果正在生成，请去我的投注查看详情。');
                    }
                } else {
                    this.$toast('投注结果正在生成，请去我的投注查看详情。');
                }
            }).catch((error) => {
                this.$toast('投注结果正在生成，请去我的投注查看详情。');
            })
        },
        async getInit() {
            let balance = await Contract.methods.getContractBalance().call();
            let max = await Contract.methods.hashBetMax().call();
            let min = await Contract.methods.hashBetMin().call();
            balance = bigNumberNum(balance);
            max = bigNumberNum(max);
            min = bigNumberNum(min);
            this.balance = balance;
            this.max = max;
            this.min = min;
        },
        deleteNumber(index) {
            console.log(index);
            if (this.chooseNumber[index] && this.chooseNumber[index] !== '') {
                // this.filterInit(this.chooseNumber[index]);
                // this.chooseNumber[index] = '';
                this.$set(this.chooseNumber, index, ''); //解决数组数据单个更新，视图不更新的问题
                console.log(this.chooseNumber);
            }
        },
        addNumber(item, index) {
            for (let i = 0; i < this.chooseNumber.length; i++) {
                let chooseItem = this.chooseNumber[i];
                if (chooseItem !== '') {
                    continue;
                } else {
                    // this.chooseNumber[i] = item.value;
                    this.$set(this.chooseNumber, i, item.value);
                    break;
                }
                // if(item.state === false) {
                //   if(chooseItem !== '') {
                //     continue;
                //   }else{
                //     console.log(this.chooseNumber);
                //     item.state = true;
                //     this.chooseNumber[i] = item.value;
                //     break;
                //   }
                // }else{
                //   console.log(item);
                //   item.state = false;
                //   this.filterChoose(item.value);
                //   break;
                // }

            }
            console.log(this.chooseNumber);
        },
        // filterInit(value) {
        //   for(let i=0;i<this.initNumber.length;i++) {
        //     let initItem = this.initNumber[i];
        //     if(initItem.value === value) {
        //       this.initNumber[i].state = false;
        //       break;
        //     }else{
        //       continue;
        //     }
        //   }
        // },
        filterChoose(value) {
            for (let i = 0; i < this.chooseNumber.length; i++) {
                let chooseItem = this.chooseNumber[i];
                if (chooseItem === value) {
                    this.chooseNumber[i] = '';
                    break;
                } else {
                    continue;
                }
            }
        },
        robot() {
            let that = this;
            // for(let i=0;i<this.initNumber.length;i++) {
            //   this.initNumber[i].state = false;
            // }
            console.log(1111);
            let array = [];
            a: for (let i = 0;; i++) {
                if (array.length < 6) {
                    let rand = parseInt(Math.random() * 15).toString();
                    // for(let j=0;j<array.length;j++) {
                    //   if(array[j] === rand) {
                    //     continue a;
                    //   }
                    // }
                    // for(let k=0;k<this.initNumber.length;k++) {
                    //   // this.initNumber[k].state = false;
                    //   if(this.initNumber[k].value === rand) {
                    //     this.initNumber[k].state = true;
                    //   }
                    // }
                    console.log(this.initNumber);
                    array.push(rand);
                } else {
                    break;
                }

            }
            this.chooseNumber = array;
        },
        async bet() {
            let that = this;
            if (!this.wallet || this.wallet === '') {
                this.$toast('请点击登录按钮添加用户钱包！');
                return;
            }
            if (!this.amount || this.amount === '' || this.amount === 0) {
                this.$toast('投注金额不能为空！');
                return;
            }
            let checkAmount = parseFloat(Number(this.amount));
            let checkMin = parseFloat(Number(this.min));
            let checkMax = parseFloat(Number(this.max));
            if (checkAmount < checkMin || checkAmount > checkMax) {
                this.$toast('投注金额不能少于' + this.min + '且不能高于' + this.max);
                return;
            }
            let checkBalance = parseFloat(Number(this.wallet.balance) - 0.000000000002);
            if (checkAmount > checkBalance) {
                this.$toast("可用余额不足！");
                return;
            }

            let params = '';
            for (let i = 0; i < this.chooseNumber.length; i++) {
                if (this.chooseNumber[i] !== '') {
                    let hexNumber = cita.utils.toHex(this.chooseNumber[i]).substring(2);
                    console.log(hexNumber);
                    params += hexNumber;
                    continue;
                } else {
                    this.$toast('投注选号位数不对！');
                    return;
                }
            }

            console.log(params);
            let data = await Contract.methods.play("0x" + params).encodeABI();
            this.data = data;
            if (this.flag === 'true') {
                console.log(tx);

                let amount = cita.utils.toHex(cita.utils.toWei(this.amount));
                let quota = cita.utils.toHex(this.gas);
                // let amount = bigNumberNumFixed(this.amount)
                // amount = cita.utils.toBN(amount).toString(16);
                let tx = {
                    to: Contract._address,
                    quota: quota,
                    value: amount,
                    data: this.data
                }
                console.log(JSON.stringify(tx));
                window.paraboxWallet.sendTransaction(tx).then(hash => {
                    console.log(hash);
                    this.$toast.loading({
                        mask: true,
                        message: '交易确认中...',
                        duration: 0,
                    });
                    cita.listeners.listenToTransactionReceipt(hash).then((data) => {
                      if (data.errorMessage && data.errorMessage !== '') {
                          this.$toast(data.errorMessage);
                          return;
                      } else {
                        that.timerSuc = setTimeout(() => {
                            that.getEvent(hash);
                        }, 3000);
                      }
                    });
                    // "0x7d1ad00aa941242c97e191ea3819a74e7115638102c538e9d549a54438dddf8e"
                }).catch(err => {
                    this.$toast(err)
                })
            } else {
              this.sendVisible = true;
            }

        },
        confirm() {
            // let checkAmount = parseFloat(Number(this.amount));
            // let checkBalance = parseFloat(Number(this.wallet.balance) - 0.000000000002);
            // if (checkAmount > checkBalance) {
            //     this.$toast("可用余额不足！");
            //     return;
            // }
            if (!this.password || this.password === '') {
                this.$toast('钱包密码不能为空！');
                return;
            }
            this.$toast.loading({
                mask: true,
                message: '投注中...',
                duration: 0,
            });
            this.timer = setTimeout(this.send, 1000);

        },
        async send() {
            let that = this;
            clearTimeout(that.timer);
            // amount = amount.toString();
            let signData = await signTransaction(this.wallet.address, this.password, this.amount, Contract._address, this.data);
            cita.base.sendSignedTransaction(signData).then((result) => {
                cita.listeners.listenToTransactionReceipt(result.hash).then((data) => {
                    if (data.errorMessage && data.errorMessage !== '') {
                        that.$toast(data.errorMessage);
                        return;
                    } else {
                        that.timerSuc = setTimeout(() => {
                            that.$toast.clear();
                            // that.$router.push({path:'/home'});
                            this.sendVisible = false;
                            that.getEvent(data.transactionHash);

                        }, 3000); //3秒出一个块，保证到首页后的数据及时性
                    }
                });
            }).catch((err) => {
                that.$toast("请确认交易密码是否正确！");
            })
        },
        dialogCancel() {
            this.sendVisible = false;
        },
    }
}
</script>

<style lang="less" scoped>
@import '../../common/less/mixin.less';
.game {
    width: 100%;
    height: 100%;
    .game-pull {
      width: 100%;
      height:100%;
      padding-top: 20px;
      box-sizing: border-box;
      overflow-y: auto;
        .game-top {
          width: 92.27%;
          margin: 0 auto;
          padding: 20px 0 0;
          .border-btm(#e1e1ef);

          .right-bg-ic {
            width:32px;
            height:32px;
            border-radius: 16px;
            background-color: #9373EC;
            display: inline-block;
            vertical-align: middle;
            overflow: hidden;
            position: absolute;
            right:0;
            top:0;
          }

          .right-text-ic {
            position: absolute;
            right:0;
            top:0;
            height:25px;
            padding: 0 10px;
            line-height: 25px;
            background-color: #9373EC;
            color:#fff;
            border-radius: 5px;
            font-size: 12px;
            box-sizing: border-box;
          }

          .game-pool {
              font-size: 16px;
              line-height: 21px;
              color: #585858;
              font-weight: bold;
              text-align: center;
              margin-bottom: 20px;
          }

          .game-ul {
              width: 63.58%;
              margin: 0 auto;
              overflow: hidden;

              li {
                  width: 24%;
                  float: left;
                  text-align: center;
                  margin-bottom: 20px;

                  .van-button {
                      width: 40px;
                      height: 40px;
                      border-radius: 20px;
                      border: 1px solid #c5c5c5;
                      font-size: 14px;
                      color: #858585;
                      line-height: 40px;
                      box-sizing: border-box;
                      margin: 0 auto;
                      font-weight: bold;
                      padding: 0;

                      &.active {
                          background-color: #9373ec;
                          border-color: #9373ec;
                          color: #fff;
                      }
                  }
              }
          }
      }

      .game-bottom {
          width: 92.27%;
          margin: 0 auto;
          padding-bottom: 50px;

          .game-mine {
              width: 100%;
              line-height: 35px;
              padding: 0 10px;
              font-size: 12px;
              overflow: hidden;
              box-sizing: border-box;

              .game-mine-left {
                  float: left;
                  color: #585858;
              }

              .game-mine-right {
                  float: right;
                  color: #358cef;
              }
          }

          .game-number {
              width: 100%;
              overflow: hidden;
              margin-bottom: 20px;

              li {
                  width: 16.66%;
                  float: left;
                  text-align: center;

                  p {
                      width: 40px;
                      height: 40px;
                      border-radius: 20px;
                      border: 1px solid #c5c5c5;
                      font-size: 14px;
                      color: #858585;
                      line-height: 40px;
                      box-sizing: border-box;
                      margin: 0 auto;
                      font-weight: bold;

                      &.active {
                          background-color: #9373ec;
                          border-color: #9373ec;
                          color: #fff;
                      }
                  }
              }
          }

          .game-amount {
              width: 255px;
              margin: 0 auto;
              border: 1px solid #707070;
              box-sizing: border-box;
              border-radius: 4px;
              line-height: 12px;
              font-size: 12px;

              .clearfix;

              .game-input {
                  float: left;
                  width:calc(100% - 30px);
                  border:0;
                  border-radius: 4px;
                  padding:12px 10px;
                  font-size: 12px;
                  line-height: 16px;
                  box-sizing: border-box;
                  color:#c2c2c2;
              }

              .game-unit {
                  float: left;
                  width: 30px;
                  color: #858585;
                  font-weight: bold;
                  line-height: 40px;
              }
          }

          .game-limit {
              width: 255px;
              margin: 0 auto;
              text-align: right;
              font-size: 11px;
              line-height: 15px;
              color: #c2c2c2;
              margin-top: 5px;
          }

          .game-button {
              width: 255px;
              margin: 0 auto;
              border: 1px solid #358cef;
              box-sizing: border-box;
              border-radius: 8px;
              line-height: 44px;
              font-size: 14px;
              color: #fff;
              text-align: center;
              height: 44px;
              background-color: #358cef;
              margin-top: 30px;
              margin-bottom: 20px;

          }
      }
    }



    .prize-result {
        position: relative;
        width: 100%;

        .proze-level {
            position: absolute;
            top: 110px;
            text-align: center;
            width: 100%;
            font-size: 25px;
            line-height: 28px;
            color: #9f3333;
            letter-spacing: 10px;
            font-family: serif;
        }
    }

    .game-dialog {
        width: 310px;
        // height:285px;
        background-color: #fff;
        border-radius: 8px;

        .dialog-main {
            width: 255px;
            margin: 16px auto 20px;

            .dialog-title {
                font-size: 14px;
                line-height: 19px;
                color: #585858;
                text-align: center;
                font-weight: 600;
            }

            .dialog-amount {
                font-size: 18px;
                line-height: 24px;
                margin-top: 2px;
                color: #585858;
                text-align: center;
                font-weight: 600;
                margin-bottom: 8px;
            }

            .dialog-item {
                width: 100%;
                font-size: 12px;
                line-height: 16px;
                color: #585858;
                padding: 5px 0;
                .clearfix;

                .dialog-item-left {
                    float: left;
                }

                .dialog-item-right {
                    float: right;
                    width: 150px;
                    text-align: right;
                    .omit;
                }

                .dialog-item-field {
                    background: rgba(255, 255, 255, 1);
                    border: 1px solid rgba(196, 196, 196, 1);
                    opacity: 1;
                    border-radius: 4px;
                    padding: 5px 10px;
                    margin: 0 auto;
                    color: #c2c2c2;
                }

                .dialog-cancel {
                    float: left;
                    width: 110px;
                    height: 39px;
                    background: rgba(255, 255, 255, 1);
                    border: 1px solid rgba(112, 112, 112, 1);
                    opacity: 1;
                    border-radius: 8px;
                    font-size: 14px;
                    line-height: 39px;
                    text-align: center;
                    box-sizing: border-box;
                }

                .dialog-confirm {
                    float: right;
                    width: 110px;
                    height: 39px;
                    background: rgba(116, 177, 34, 1);
                    opacity: 1;
                    border-radius: 8px;
                    font-size: 14px;
                    line-height: 39px;
                    color: #fff;
                    text-align: center;
                    box-sizing: border-box;
                }
            }

        }
    }
}
</style>
