<template>
  <div @click="zoomOut" class="zoomout2" title="缩小">
    <i class="iconfont icon-iconjian"></i>
  </div>
</template>

<script>
// import Globel from '@/components/globel.vue'
//  import MapUtil from "@/components/map/mapUtil.vue"
export default {
  name: 'ZoomOut2',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    zoomOut () {
      let view = window.map.getView()
      let zoom = view.getZoom()
      view.setZoom(zoom - 1)
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
.active img {
  border: 1px solid #ddd;
}
</style>
