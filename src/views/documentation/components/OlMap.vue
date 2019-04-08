<template>
    <div class="map-container">
        <div id="map" ref="rootmap"></div>
        <Maptools :maptools="maptools"></Maptools>
    </div>
</template>

<script>
import Maptools from "@/components/map/maptools.vue";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import Attribution from 'ol/control/Attribution'

var mapUrl = {
    /****
     * 高德地图
     * lang可以通过zh_cn设置中文，en设置英文，size基本无作用，scl设置标注还是底图，scl=1代表注记，
     * scl=2代表底图（矢量或者影像），style设置影像和路网，style=6为影像图，
     * vec——街道底图
     * img——影像底图
     * roadLabel---路网+标注
     */
    "aMap-img": "http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    "aMap-vec": "http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    "aMap-roadLabel": "http://webst0{1-4}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",
    /***
     * 天地图 要key的
     * vec——街道底图
     * img——影像底图
     * ter——地形底图
     * cva——中文注记
     * cta/cia——道路+中文注记 ---roadLabel
     */
    "tian-img": "http://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=你的密钥",
    "tian-roadLabel": "http://t{0-7}.tianditu.gov.cn/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=你的密钥",
    "tian-label": "http://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=你的密钥",
    "tian-vec": "http://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=你的密钥",
    "tian-ter": "http://t{0-7}.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=你的密钥",
    /***
     *geoq地图
     * http://cache1.arcgisonline.cn
     * http://map.geoq.cn
     * vec：标准彩色地图
     * gray、blue、warm
     * line 中国轮廓图
     * china 中国轮廓图+标注
     * Hydro 水系
     * green 植被
     */
    "geoq-vec": "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
    "geoq-gray": "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
    "geoq-blue": "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
    "geoq-warm": "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}",
    "geoq-line": "http://cache1.arcgisonline.cn/arcgis/rest/services/SimpleFeature/ChinaBoundaryLine/MapServer/tile/{z}/{y}/{x}",//不稳定
    "geoq-china": "http://thematic.geoq.cn/arcgis/rest/services/ThematicMaps/administrative_division_boundaryandlabel/MapServer/tile/{z}/{y}/{x}",//不稳定
    "geoq-Hydro": "http://thematic.geoq.cn/arcgis/rest/services/ThematicMaps/WorldHydroMap/MapServer/tile/{z}/{y}/{x}",//不稳定
    "geoq-green": "http://thematic.geoq.cn/arcgis/rest/services/ThematicMaps/vegetation/MapServer/tile/{z}/{y}/{x}",//不稳定
    /***
     * Google
     * m 街道
     * s 影像
     */
    "google-vec": "http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}",
    "google-img": "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
 
};

/*
ol.source.onlineMap = function (options) {
    var options = options ? options : {};
 
    var attributions;//右下角标识
    if (options.attributions !== undefined) {
        attributions = option.attributions;
    } else if (options.mapType.indexOf("aMap") != -1) {
        attributions = new ol.Attribution({
            html: '&copy; <a class="ol-attribution-amap" ' + 'href="http://ditu.amap.com/">' + '高德地图</a>'
        });
    } else if (options.mapType.indexOf("tian") != -1) {
        attributions = new ol.Attribution({
            html: '&copy; <a class="ol-attribution-tianmap" ' + 'href="http://www.tianditu.cn/">' + '天地图</a>'
        });
    } else if (options.mapType.indexOf("geoq") != -1) {
        attributions = new ol.Attribution({
            html: '&copy; <a class="ol-attribution-geoqmap" ' + 'href="http://www.geoq.net/basemap.html">' + '智图地图</a>'
        });
    } else if (options.mapType.indexOf("google") != -1) {
        attributions = new ol.Attribution({
            html: '&copy; <a class="ol-attribution-googlemap" ' + 'href="http://www.google.cn/maps">' + '谷歌地图</a>'
        });
    }
    var url = mapUrl[options.mapType];
    ol.source.XYZ.call(this, {
        crossOrigin: 'anonymous',   //跨域
        cacheSize: options.cacheSize,
        projection: ol.proj.get('EPSG:3857'),
        url: url,
        attributions: attributions,
        wrapX: options.wrapX !== undefined ? options.wrapX : true
    });
};
ol.inherits(ol.source.onlineMap, ol.source.XYZ);//必需
*/

var attributions = new Attribution({
    html: '&copy; <a class="ol-attribution-amap" ' + 'href="http://ditu.amap.com/">' + '高德地图</a>'
});
export default {
  components: {
      Maptools
  },
  props: ['maptools'],
  data() {
    return {
      map: null
    };
  },
  mounted() {
    var mapcontainer = this.$refs.rootmap;
    this.map = new Map({
        layers: [
            new TileLayer({
                title: "高德影像地图",
                //visible:false,
                source: new XYZ({
                    url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                    attributions: attributions,
                })
            }),
            new TileLayer({
                title: "高德矢量图",
                source: new XYZ({
                    url: 'http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
                    attributions: attributions,
                })
            }),
            new TileLayer({
                title: "高德路网地图",
                visible:false,
                source: new XYZ({
                    url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
                    attributions: attributions,
                })
            })
        ],
        target: 'map',
        view: new View({
            projection: "EPSG:4326",    //使用这个坐标系
            center: [114.064839,22.548857],  //深圳
            zoom: 12
        })
    });
    /*
    this.map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        projection: "EPSG:4326",    //使用这个坐标系
        center: [114.064839,22.548857],  //深圳
        zoom: 12
      })
    });
    */
  }
};
</script>

<style>
.map-container, #map {
    width: 100%;
    height: 100%;
}
/*隐藏ol的一些自带元素*/
.ol-attribution,.ol-zoom { display: none;}

</style>