<template>
  <div class="maptools" :class="{'right-margin':searchResultShow||statisticShow}">
    <ul>
      <li @click="closeIdentify" v-if="isShow('pan')">
        <Pan></Pan>
      </li>
      <li @click="closeIdentify" v-if="isShow('zoomin')">
        <ZoomIn2></ZoomIn2>
      </li>
      <li @click="closeIdentify" v-if="isShow('zoomout')">
        <ZoomOut2></ZoomOut2>
      </li>
      <!--<li @click="closeIdentify" v-if="isShow('clear')">-->
        <!--<ClearMap></ClearMap>-->
      <!--</li>-->
      <li  v-if="isShow('fullextent')">
        <FullExtent></FullExtent>
      </li>
      <li @click="closeIdentify" v-if="isShow('layermanager')">
        <layer-manager></layer-manager>
      </li>
      <li @click="closeIdentify" v-if="isShow('statistic')">
        <statistic></statistic>
      </li>
      <li v-if="isShow('identify')">
        <Identify></Identify>
      </li>
    </ul>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import ZoomOut2 from "@/components/map/maptools/zoomout2"
  import ZoomIn2 from "@/components/map/maptools/zoomin2"
  import ZoomIn from "@/components/map/maptools/zoomin"
  import ZoomOut from "@/components/map/maptools/zoomout"
  import Pan from "@/components/map/maptools/pan"
  import Identify from "@/components/map/maptools/identify"
  import LayerManager from "@/components/map/maptools/layermanager"
  import Statistic from "@/components/map/maptools/statistic"
  import FullExtent from "@/components/map/maptools/fullExtent";
  export default {
    name: 'Maptools',
    props: {
      maptools:{
        type: Array,
        default: function () {
          return ["pan","zoomin","zoomout","layermanager","fullextent","identify","statistic"]
        }
      }
    },
    components:{
      FullExtent,
      ZoomOut2,
      ZoomIn2,
      ZoomIn,
      ZoomOut,
      Pan,
      LayerManager,
      Statistic,
      Identify
    },
    data () {
      return {
        msg: 'Welcome to Your Vue.js  App'
      }
    },
    computed: mapState([
      'statisticShow',
      'searchResultShow',
    ]),
    methods:{
      closeIdentify(){
        this.$store.commit("close_identify");
      },
      isShow(componentName){
        return this.maptools.indexOf(componentName)>-1
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" rel="stylesheet/less" scoped>
  .maptools {
    position: absolute;
    top: 20px;
    /*left: 10px;*/
    right: 10px;
    background-color: #fff;
    /*height: 100px;*/
    width: 35px;
    border: 1px solid #ddd;
    margin-top: 10px;

    ul {
      list-style: none;
      margin: 0px;
      padding: 0px;
      width: 35px;
      text-align: center;
      li {
        margin: 7px 0;
        cursor: pointer;
        img{
          width: 26px;
          &:hover{
            border: 1px solid #ddd;
          }
        }
      }
    }
  }
  .right-margin{
    right: 480px;
    transition: right 1s;
  }
</style>
