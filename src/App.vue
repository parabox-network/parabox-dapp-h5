<template>
  <div id="app">
      <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  html,body {
    width:100%;
    height:100%;
  }
  #app {
    width:100%;
    height:100%;
  }
  .van-pull-refresh__track {
    min-height: 500px!important;
  }
  ::-webkit-scrollbar {/*滚动条整体样式*/
    width: 0;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 0;
  }
</style>
