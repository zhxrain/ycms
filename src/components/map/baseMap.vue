<template>
  <div class="basemap-seletor" id="map_select" @mouseenter="enter" @mouseleave="leave"
       :class="{'right-margin':searchResultShow||statisticShow,up:imgBarShow}">
      <ul >
        <li v-for="basemap in basemaps" v-show="basemap.show">
            <div class="map_name"  @click="layerSelect(basemap.name)" :style="{backgroundImage: basemap.imgUrl}"></div>
        </li>
      </ul>
    </div>
</template>
<script>
// import Globel from '@/components/globel.vue'
import XYZ from 'ol/source/XYZ'
import Tile from 'ol/layer/Tile';
import WMTS from 'ol/source/WMTS.js';
import {getWidth, getTopLeft} from 'ol/extent.js';
import {get as getProjection} from 'ol/proj.js';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import { mapState } from 'vuex'

export default {
  name: 'BaseMap',
  props: ['baseLayerUrl', 'annotionLayerUrl'],
  methods: {
    layerSelect (selectName) {
      this.currentBasemap = selectName
      let server, source
      switch (selectName) {
        case 'aMap':
          server = 'aMap'
          source = 'Normal'
          break
        case 'Satellite':
          server = 'aMap'
          source = 'Satellite'
          break
        case 'ter':
          server = 'aMap'
          source = 'Terrain'
          break
      }
      this.$emit('changeBaseMapUrl', {
        server: server,
        source: source
      })
    },
    enter () {
      for (let i in this.basemaps) {
        this.basemaps[i].show = true
      }
    },
    leave () {
      for (let i in this.basemaps) {
        this.basemaps[i].name === this.currentBasemap ? this.basemaps[i].show = true : this.basemaps[i].show = false
      }
    }
  },
  computed: mapState([
    'statisticShow',
    'searchResultShow',
    'imgBarShow',
  ]),
  watch: {
    baseLayerUrl () {
        this.$emit("removeLayer","basemap");
        this.$emit("removeLayer","annotionLayer");
        let layer = new Tile({
            id: "basemap",
            zIndex: 0,
            source: new XYZ({
                url: this.baseLayerUrl
            })
        });
        layer.setZIndex(0);
        window.map.addLayer(layer);
        let annolayer = new Tile({
            id: "annotionLayer",
            zIndex: 1,
            source: new XYZ({
                url: this.annotionLayerUrl
            })
        });
        window.map.addLayer(annolayer);
    }
  },
  data () {
    return {
      basemaps: [
        {
          name: 'Tianditu',
          label: '矢量地图',
          show: true,
          opacity: 1,
          imgUrl: 'url(' + require('../../assets/map/ditu/gaode.png') + ')'
        },
        {
          name: 'Satellite',
          label: '卫星地图',
          show: false,
          opacity: 0,
          imgUrl: 'url(' + require('../../assets/map/ditu/tiandituweixing.png') + ')'
        }
      ],
      currentBasemap: 'Tianditu'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" rel="stylesheet/less" scoped>
  .basemap-seletor{
    position: absolute;
    bottom: 10px;
    right: 10px;
    transition: right 1s,bottom 1s;
    z-index: 98;
    width: auto;
    height: 56px;
    background: rgba(255, 255, 255, .7);
    border-radius: 3px;
    box-shadow: -5px 5px 15px rgba(0, 0, 0, .4);
    ul{
      display: block;
      margin: 0;
      padding: 0 5px 0 0;
      line-height: 56px;
      :nth-child(1){
        display: block;
      }
    }
    li{
      list-style: none;
      float: left;
      width: 66px;
      height: 44px;
      margin: 6px 0 6px 5px;
      box-sizing: border-box;
      border: 1px solid #5599fe;
      border-radius: 3px;
      cursor: pointer;
      .map_name {
        display: inline-block;
        width: 100%;
        height: 100%;
        line-height: 20px;
        font-size: 10px;
        float: left;
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        transition: all 0.5s;
        filter: alpha(opacity=0);
        vertical-align: middle;
      }
      :nth-child(1) {
        background: center /74px 56px no-repeat;
        color: #000;
      }
      :nth-child(2) {
        background:  center /74px 56px no-repeat;
      }
    }
  }
  .right-margin{
    right: 480px;
    transition: right 1s;
  }
  .up{
    bottom: 140px;
    transition: bottom 1s;
  }
</style>
