<template>
  <div @click="zoomIn" class="zoomin2" title="放大">
    <i class="iconfont icon-iconjia"></i>
  </div>
</template>

<script>
// import Globel from '@/components/globel.vue'
export default {
  name: 'ZoomIn2',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    zoomIn () {
      let view = window.map.getView()
      let zoom = view.getZoom()
      view.setZoom(zoom + 1)
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
