<template>
  <div @click="Clear" class="clear" title="清除图层">
    <i class="iconfont icon-xiangpi"></i>
  </div>
</template>

<script>
// import Globel from '@/components/globel.vue'
import MapUtil from '@/components/map/mapUtil.vue'
export default {
  name: 'ClearMap',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  inject: ['getPointLayers'],
  methods: {
    Clear () {
      MapUtil.removeAllLayer(this.$store.state.clearExcludeLayers);
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
