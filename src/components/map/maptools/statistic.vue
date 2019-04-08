<template>
  <div @click="switchStatistic" class="zoomin2" title="统计" :class="statisticShow? 'selected':''">
    <i class="iconfont icon-tongji"></i>
  </div>
</template>

<script>
  // import Globel from '@/components/globel.vue'
  export default {
    name: 'Statistic',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    computed: {
      statisticShow () {
        return this.$store.state.statisticShow
      }
    },
    methods: {
      switchStatistic(){
        this.$store.commit("switchStatistic")
        if(this.statisticShow){
          this.$root.eventHub.$emit("clearSearch");
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" rel="stylesheet/less" type="text/less">
  i {
    font-size: 18px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    &:hover {
      border: 1px solid #ddd;
    }
  }
  .selected{
    color:#409eff;
  }
  .active img {
    border: 1px solid #ddd;
  }
</style>
