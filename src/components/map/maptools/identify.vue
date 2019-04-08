<template>
  <div @click="Identify" class="identify"  :class="identifyState? 'selected':''" title="点击查询">
    <!--<img src="../../../assets/map/identify.png" class="identify-img" >-->
    <i class="iconfont icon-dianji"></i>
  </div>
</template>

<script>
// import Globel from '@/components/globel.vue'
import MapUtil from '@/components/map/mapUtil.vue'
export default {
  name: 'Identify',
  data () {
    return {
    }
  },
  computed: {
    identifyState () {
      return this.$store.state.identify
    }
  },
  methods: {
    Identify () {
      if (MapUtil.zoomdraw) {
        window.map.removeInteraction(MapUtil.zoomdraw)
        MapUtil.zoomdraw = undefined
      }
      this.$store.commit('switch_identify')
    },
    clearHighLightLayer () {
      let layer = MapUtil.getLayer('highLight')
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
  /*background: url("../../../assets/map/identify_selected.png");*/
  color:#409eff;
}
.active img {
  border: 1px solid #ddd;
}
</style>
