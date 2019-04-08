<template>
  <div @click="zoomIn" class="zoomin" title="拉框放大">
    <img src="../../../assets/map/toolbox_rect_zoomin1.png">
  </div>
</template>

<script>
// import Globel from '@/components/globel.vue'
import MapUtil from '@/components/map/mapUtil.vue'
import {Collection} from 'ol'
import Polygon from 'ol/geom/Polygon'
import Draw from 'ol/interaction/Draw'
export default {
  name: 'ZoomIn',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    zoomIn () {
      var zoomdraw

      var features = new Collection()
      zoomdraw = new Draw({
        features: features,
        type: 'LineString',
        maxPoints: 2,
        geometryFunction: function (coordinates, geometry) {
          var start = coordinates[0]
          var end = coordinates[1]
          if (!geometry) {
            geometry = new Polygon([
              [start, [start[0], end[1]], end, [end[0], start[1]], start]
            ])
          } else {
            geometry.setCoordinates([
              [start, [start[0], end[1]], end, [end[0], start[1]], start]
            ])
          }
          return geometry
        }
      })
      window.map.addInteraction(zoomdraw)
      MapUtil.zoomdraw = zoomdraw
      zoomdraw.on(
        'drawend',
        function (evt) {
          var geom = evt.feature.getGeometry()
          var point = geom.getCoordinates()
          var view = window.map.getView()
          var zoom = view.getZoom()
          view.setCenter(point[0][0])
          view.setZoom(zoom + 1)
          window.map.removeInteraction(zoomdraw)
          MapUtil.zoomdraw = undefined
        },
        this
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" rel="stylesheet/less" type="text/less">
img {
  width: 26px;
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
