<template>
  <div class="bet">
    <v-header style="position:fixed;z-index:1000" v-on:toParentStatus="getStatus" :title="title" :rightText="rightText" :rightArray="rightArray"></v-header>
	<van-pull-refresh style="padding-top:50px;height:calc(100% - 50px);overflow-y:auto;" v-model="isLoading" @refresh="onRefresh">
    <div class="bet-main">
		<van-list
			v-model="loading"
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad"
			class="bet-main-ul"
			>
			<li v-for="item in list" :key="item.txhash">
				<div class="li-img" v-if="!item.lotter || item.lotter === 0">
					<img style="width:100%" src="../../images/list-fail.svg" alt>
					<p class="level">未中奖</p>
				</div>
				<div class="li-img" v-else>
					<img style="width:100%" src="../../images/AlrPrizeFlag.svg" alt>
					<p class="level">{{item.lotter | prizeLevel}}</p>
				</div>
				<p class="hash-title">
					交易哈希
					<span>{{item.timestamp | dateForm}}</span>
				</p>
				<p class="hash-value">{{item.txhash}}</p>
				<div class="li-item">
					<div class="item-left">
					<p>我的选号</p>
					<p>{{item.betHash | prizeTo}}</p>
					<p>开奖号码</p>
					<p>{{item.hash | prizeTo}}</p>
					</div>
					<div class="item-right">
					<p>投注金额</p>
					<p class="betAmount">{{item.betAmount | amountForm}} {{unit}}</p>
					<p>奖金</p>
					<p>{{item.prize | amountForm}} {{unit}}</p>
					</div>
				</div>
			</li>
		</van-list>
		<!-- <ul class="bet-main-ul">
			<li>
			<div class="li-img">
				<img style="width:100%" src="../../images/AlrPrizeFlag.svg" alt>
				<p class="level">四等奖</p>
			</div>
			<p class="hash-title">
				交易哈希
				<span>2019-08-15 13:25</span>
			</p>
			<p class="hash-value">0x00000000000000000000000000000000000000000000</p>
			<div class="li-item">
				<div class="item-left">
				<p>我的选号</p>
				<p>10，14，12，11，15，16</p>
				<p>开奖号码</p>
				<p>10，4，5，6，7，8</p>
				</div>
				<div class="item-right">
				<p>投注金额</p>
				<p>10000 {{unit}}</p>
				<p>奖金</p>
				<p>0 {{unit}}</p>
				</div>
			</div>
			</li>
		</ul> -->
    </div>
	</van-pull-refresh>
  </div>
</template>

<script>
import vHeader from "../../common/components/header";
import {getPrizeList} from "../../api";
import moment from 'moment';
import {bigNumberNum} from '../../common/js/bignumber';
import cita from '../../common/js/cita';
import {getStorage} from '../../common/js/storage';
export default {
  components: {
    vHeader
  },
  data() {
    return {
      title: "我的投注",
      rightText: "筛选",
      rightArray: [
        {
          name: "全部",
          type: 0
        },
        {
          name: "未中奖",
          type: -1
        },
        {
          name: "已中奖",
          type: 1
        }
	  ],
	  isLoading: false,
	  loading:false,
	  finished:false,
	  list:[],
	  pageNum:0,
	  pageSize:10,
	  status:0,
	  wallet:''
    };
  },
  mounted() {
	  let walletData = getStorage('ticketKeystore');
    if(walletData && walletData !== '') {
      walletData = JSON.parse(walletData);
      this.wallet = walletData;
    }else{
      this.$toast("请先创建用户钱包");
      return;
    }
  },
  methods: {
    initList() {
		this.list = [];
		this.getList(0).then((res)=>{
			this.list = res;
		}).catch((error)=>{
			this.$toast(error);
		})
	},
	getList(pageNum) {
		return new Promise((resolve,reject)=>{
			// let params = {
			// 	parameter:"0",
			// 	pageNum : pageNum,
			// 	pageSize:this.pageSize
			// }

				let params = {parameter: this.status ,pageNum:pageNum,pageSize:this.pageSize,player:this.wallet.address}
				getPrizeList(params).then((res) => {
					// console.log(res);

					if(res.code && res.code === 200) {
						resolve(res.data);
					// 	if(res.data.data && res.data.data.length>0) {
					// 		resolve(res.data.data);
					// 	}else {
					// 		this.finished = true;
					// 		this.loading = false;
					// 	}
					// }else{
					// 	this.$toast(res.msg);
					// 	this.loading = false;
					}else{
						// this.$toast(res.msg);
						reject({message:res.msg});
						// throw new ErrorEvent(res.msg);
					}
				}).catch((error)=>{
					reject(error.message);
				})
		})
	},
	onRefresh() {
      setTimeout(() => {
		this.$toast('刷新成功');
		this.list = [];
    this.pageNum = 0;
    this.loading = true;
		this.isLoading = false;
		this.finished = false;
		this.onLoad();

      }, 500);
	},
	onLoad() {
		let oldList = this.list;
		this.getList(this.pageNum).then((res)=>{
			if(res.data && res.data.length>0) {
				this.list = [...oldList,...res.data];
				this.pageNum ++ ;
				this.loading =false;
			}else {
        this.loading = false;
				this.finished = true;
			}
		}).catch((error)=>{
      this.loading = false;
      this.finished = true;
			this.$toast(error.message);
		})
	},
	getStatus(e){
		this.status = e;
		this.list = [];
		this.pageNum = 0;
		this.isLoading = false;
		this.finished = false;
		this.onLoad();
	}
  },
  filters:{
	  dateForm:function(date){
		  return moment(date).format("YYYY-MM-DD HH:mm");
	  },
	  amountForm:function(value) {
		  return bigNumberNum(value);
	  },
	  prizeTo:function(array) {
		  let number = '';
		  for(let i=0;i<array.length;i++) {
			  number += cita.utils.hexToNumber("0x"+array[i]) + ","
		  }
		  return number;
	  },
	  prizeLevel:function(level) {
		  let levelText;
		  switch(level) {
			  case 1:
				levelText = "一等奖";
			  	break;
			  case 2:
			  	levelText = "二等奖";
			  	break;
			  case 3:
			  	levelText = "三等奖";
			  	break;
			  case 4:
			  	levelText = "四等奖";
			  	break;
			  case 5:
			  	levelText = "五等奖";
			  	break;
			  case 6:
			  	levelText = "六等奖";
			  	break;
			  default:
			    break;
		  }
		  return levelText;
	  }
  }
};
</script>

<style lang="less" scoped>
@import "../../common/less/mixin.less";
.bet {
  width: 100%;
  height: 100%;

  .bet-main {
    width: 100%;

    .bet-main-ul {
      margin: 0 15px;
      padding-bottom: 50px;

      li {
        padding: 15px 15px 0;
        width: 100%;
        box-sizing: border-box;
        font-size: 12px;
        line-height: 16px;
        position: relative;
        .border-btm(#e1e1e1);

        .li-img {
          position: absolute;
          top: 4px;
          right: -20px;
          width: 60px;

          .level {
            position: absolute;
            top: 3px;
            right: 10px;
            font-size: 12px;
            color: #fff;
          }
        }

        .hash-title {
          color: #585858;

          span {
            color: #bfbfbf;
            margin-left: 10px;
          }
        }

        .hash-value {
          width: 100%;
          color: #2491e4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: bold;
        }

        .li-item {
          width: 100%;
          margin-top: 10px;
          overflow: hidden;
          color: #585858;
          font-size: 12px;
		  line-height: 16px;

		  .betAmount {
			  width:100%;
			  overflow: hidden;
			  text-overflow: ellipsis;
			  white-space: nowrap;
		  }

          .item-left,
          .item-right {
            float: left;
            width: 50%;

            p {
              &:nth-child(2n + 2) {
                margin-bottom: 10px;
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }
}
</style>
