<template>
  <div @click="Pan" class="pan" title="平移">
    <i class="iconfont icon-pingyi"></i>
  </div>
</template>

<script>
// import Globel from '@/components/globel.vue'
import MapUtil from '@/components/map/mapUtil.vue'
export default {
  name: 'Pan',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    Pan () {
      if (MapUtil.zoomdraw) {
        window.map.removeInteraction(MapUtil.zoomdraw)
        MapUtil.zoomdraw = undefined
      }
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
