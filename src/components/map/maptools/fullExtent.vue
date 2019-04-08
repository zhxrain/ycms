<template>
  <div @click="fullextent" class="clear" title="全图">
    <i class="iconfont icon-quantu"></i>
  </div>
</template>

<script>
// import Globel from '@/components/globel.vue'
import MapUtil from '@/components/map/mapUtil.vue'
export default {
  name: 'FullExtent',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    fullextent () {
      window.map.getView().fit([118.98286602474953, 25.796353943077396, 119.72924969174171, 26.340863830772708])
      // this.getPointLayers();
      // this.$store.commit("setConditionStr","");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" rel="stylesheet/less" type="text/less" scoped>
i {
  font-size: 18px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  &:hover {
    border: 1px solid #ddd;
  }
}
.active img {
  border: 1px solid #ddd;
}
</style>
