<template>
  <div class="lengend" :class="{'right-margin':searchResultShow||statisticShow,up:imgBarShow}" >
    <div class="legendSwi legendSwiLabel_up " :class="show?'legendActive':''" id="legendSwi" @click="show=!show">
      <span>图例</span>
    </div>
    <div class="legend" id="legend" style="display: block;" v-show="show">
      <h5 class="legendTitle">图例</h5>
      <ul>
        <li class="legendItem" v-for="lengendItem of lengends" >
            <span class="point" v-if="lengendItem.type==='point'">
              <span class="legendImage"><img :src="lengendItem.url" alt=""></span><span class="legendName">{{lengendItem.label}}</span>
            </span>
          <span class="line" v-if="lengendItem.type==='line'">
              <span class="legendLine"></span><span class="legendName">{{lengendItem.label}}</span>
            </span>
          <span class="polygon" v-if="lengendItem.type==='polygon'">
              <span class="legendPolygon"></span><span class="legendName">{{lengendItem.label}}</span>
            </span>
          <span class="wms" v-if="lengendItem.type==='wms'">
              <img :src="lengendItem.url">
          </span>
          <span class="arcgis-rest" v-if="lengendItem.type==='arcgisRest'">
              <ul>
                <li class="arcgis-legend" v-for="arcLengend of lengendItem.lengends">
                  <span class="legendImage"><img :src="'data:image/png;base64,'+arcLengend.imageData" alt=""></span><span class="legendName">{{arcLengend.label!=""?arcLengend.label:lengendItem.label}}</span>
                </li>
              </ul>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  // import Globel from '@/components/globel.vue'
  import { mapState } from 'vuex'

  export default {
    name: 'lengend',
    props: [
      'lengends'
    ],
    computed: mapState([
      'statisticShow',
      'searchResultShow',
      'imgBarShow',
    ]),
    data() {
      return {
        show: false,
      /*  lengends: [
          {
            type: "point",
            url: "../assets/map/tuceng1.png",
            label: "点图例",
          },
          {
            type: "line",
            style: { //边界样式
              color: '#319FD3',
              width: 1,
              lineCap: "",
              // lineJoin:"",
              lineDash: [],
              miterLimit: 10,
            },
            label: "线图例",
          },
          {
            type: "ploygon",
            style: {},
            label: "面图例",
          },
          {
            type: "wms",
            layerName: "jnmc:buildlayer",
            label: "wms",
            url: "",
          },
          {
            type: "arcgisRest",
            layerName: "单体4326",
            label: "单体",
            layerUrl: "http://localhost:6080/arcgis/rest/services/fz/fzhistory_single/MapServer",
            lengends: [
              {
                "label": "",
                "url": "987cb27798f4acc1dd8a6d894e5f9b02",
                "imageData": "==",
                "contentType": "image/png",
                "height": 20, "width": 20
              }
            ]
          }
        ]*/
      }
    },
    watch: {
      lengends(newQuestion, oldQuestion) {
        for (let lengend of this.lengends) {
          if (lengend.type === 'wms') {
            lengend.url = this.$globel.gisServerHost + 'wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=' + lengend.layerName
          } else if (lengend.type === "arcgisRest") {
            this.$axios.get(lengend.url + "/legend?f=json")
              .then(res => {
                for (let l of res.data.layers) {
                  if (l.layerName === lengend.layerName) {
                    lengend.lengends=l.legend;
                  }
                }
              })
          }
        }
      }
    },
    methods: {
      initLengends() {
        for (let lengend of this.lengends) {
          switch (lengend.type) {
            case 'wms':
              lengend.url = this.$globel.gisServerHost + 'wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=' + lengend.layerName
              break
            case 'line':
              break
            case 'point':
              break
            case 'img':
              break
            case 'polygon':
              break
            case 'arcgisRest':
              this.$axios.get(lengend.layerUrl + "/legend?f=json")
                .then(res => {
                  for (let l of res.data.layers) {
                    if (l.layerName === lengend.layerName) {
                      lengend.lengends=l.legend;
                    }
                  }
                })
              break
          }
        }
      }

    },
    mounted() {
      this.initLengends()
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .lengend {
    position: absolute;
    bottom: 30px;
    z-index: 100;
    right: 10px;
    transition: right  1s,bottom 1s;
  }
  .right-margin{
    right: 480px;
    transition: right 1s;
  }
  .up{
    bottom: 160px;
    transition: bottom 1s;
  }
  .legendSwi:hover {
    color: #2c9eff;
  }

  .legendSwi {
    position: absolute;
    box-sizing: content-box;
    bottom: 76px;
    right: 10px;
    padding: 16px 0 5px 0;
    width: 35px;
    line-height: 1.5;
    cursor: pointer;
    font-size: 12px;
    color: #333;
    text-align: center;
    border-radius: 3px;
    box-shadow: -1px 2px 3px rgba(0, 0, 0, .15);
  }

  .legendSwi, .legend {
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
  }

  .legendActive {
    color: #2c9eff;
  }

  .legendSwiLabel_up {
    background: #fff url('../../assets/map/legend.png') no-repeat;
    background-position: center top;
  }

  .legend {
    position: relative;
    right: 60px;
    bottom: 50px;
    /*transition: bottom 1s;*/
    /* width: 280px; */
    padding: 15px;
    /* font-size: 0; */
    background: rgb(255, 255, 255);
    z-index: 99;
    border-radius: 4px;
    min-width: 170px;
  }
  .legendTitle {
    text-align: center;
    font-weight: 600;
    line-height: 1;
    margin: 5px auto;
  }

  .legendItem:nth-child(odd) {
    margin-left: 2%;
  }

  .legendItem:nth-child(even) {
    margin-right: 2%;
  }

  .legendItem {
    box-sizing: border-box;
    display: inline-block;
    width: 48%;
    min-height: 24px;
    margin: 0;
    line-height: 24px;
    text-align: center;
    vertical-align: middle;
    font-size: 12px;
    color: #666;
    list-style: none;
  }

  .legendItem span.legendName {
    display: inline-block;
    width: 60%;
    box-sizing: border-box;
    vertical-align: middle;
    text-align: left;
  }

  .legendItem span.legendImage {
    display: inline-block;
    width: 30%;
    margin: 0 5%;
    box-sizing: border-box;
    vertical-align: middle;
    text-align: right;
  }

  .legendItem span.legendLine {
    display: inline-block;
    width: 30%;
    margin: 0 5%;
    box-sizing: border-box;
    vertical-align: middle;
    text-align: right;
  }

  .legendItem span.legendPolygon {
    display: inline-block;
    width: 30%;
    height: 30%;
    margin: 0 5%;
    box-sizing: border-box;
    vertical-align: middle;
    text-align: right;
  }

</style>
