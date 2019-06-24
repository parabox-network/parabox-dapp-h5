<template>
    <div class="verifyMnemonic">
      <v-header :title="title"></v-header>
      <div class="verifyMnemonic-ct">
        <van-field
          v-model="phrase"
          type="textarea"
          placeholder="请输入助记词，注意单词之间需要输入空格"
          class="verifyMnemonic-area"
          rows="4"
          autosize
        />
        <div class="verifyMnemonic-bt">
          <p class="verifyMnemonic-button" @click="verifyPass">完成验证</p>
        </div>
      </div>

    </div>
</template>

<script>
  import vHeader from '../../common/components/header';
  import {checkMnemonicValidate} from '../../common/js/Mnemonic';
  import { Field,Toast } from 'vant';
	export default {
    components:{
      vHeader,
      [Field.name]:Field,
      [Toast.name]:Toast
    },
    data(){
      return {
        phrase:'',
        verifyPhrase:'',
        title:'验证助记词'
      }
    },
    mounted(){
    },
    methods:{
      verifyPass:function(){
        if(!this.phrase || this.phrase === '') {
          Toast("助记词不能为空！");
          return;
        }
        if(!checkMnemonicValidate(this.phrase) || checkMnemonicValidate(this.phrase) === false) {
          Toast("助记词格式校验不正确！");
          return;
        }
        let checkMnemonic = this.phrase.split(' ');
        if(checkMnemonic && checkMnemonic.length !== 12) {
          Toast("助记词格式不正确！");
          return;
        }

        let verifyPhrase = btoa(this.phrase);
        this.$router.push({path:'/setting',query:{verifyPhrase:verifyPhrase}});
      }
    }
	}
</script>

<style lang="less" scoped>
    @import '../../common/less/mixin.less';
    .verifyMnemonic {
      width:100%;
      height: 100%;
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
