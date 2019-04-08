<template>
  <div class="map-container">
    <div id="map"></div>
    <Maptools :maptools="maptools"></Maptools>
    <BaseMap v-if="showBaseMap" @changeBaseMapUrl="changeBaseMapUrl" @removeLayer="removeLayer" @showLayer="showLayer" @hideLayer="hideLayer"
             :base-layer-url="baseLayerUrl"
             :annotion-layer-url="annotionLayerUrl"></BaseMap>
    <div id="popup" class="ol-popup" :title="popupTitle">
      <div class="titlePane">{{popupTitle}}</div>
      <a href="#" id="popup-closer" class="ol-popup-closer" @click="closePopup"></a>
      <div id="popup-content">
        <slot name="popup-content"></slot>
      </div>
    </div>
  </div>

</template>

<script>
  import 'ol/ol.css';
  import {Extent, Map, View} from 'ol';
  import {Tile, Vector as VectorLayer} from 'ol/layer';
  import {XYZ,Cluster,TileArcGISRest, TileWMS, Vector as VectorSource, WMTS} from "ol/source";
  import Point from 'ol/geom/Point';
  import Feature from 'ol/Feature';
  import {Circle as CircleStyle,Fill, Icon, Stroke, Style, Text} from "ol/style";
  import {defaults as defaultInteractions, Draw} from 'ol/interaction.js';
  import {WFS} from 'ol/format';
  import {getTopLeft} from 'ol/extent.js';
  import {get as getProjection} from 'ol/proj.js';
  import {register} from 'ol/proj/proj4.js';
  import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
  import Overlay from 'ol/Overlay.js';
  import Maptools from "@/components/map/maptools.vue";
  import BaseMap from "@/components/map/baseMap.vue";
  import Qs from 'qs';
  import proj4 from 'proj4';
  import MultiPoint from 'ol/geom/MultiPoint';
  import MultiLineString from 'ol/geom/MultiLineString';
  import GeoJSON from 'ol/format/GeoJSON';
  import areaData from '@/assets/jsonData/areaBound.json';

  export default {
    name: "mapComponent",
    components: {
      Maptools,
      BaseMap,
    },
    props: ['showBaseMap', 'mapConfig', 'maptools'],
    data() {
      return {
        map: null,
        baseLayerUrl: null,
        annotionLayerUrl: null,
        popupTitle: "",
        popup: null,
        popupId: "popup",
        drawInteraction: null,
        project4490: null,
        lastZoom:null,
      }
    },
    computed: {
      showLayers() {
        return this.$store.state.showLayers;
      }
    },
    watch: {
      showLayers() {

      }
    },
    methods: {
      initMap() {
        this.annotionLayerUrl = this.chinaProvider({type: "Annotion"});

        //设置弹窗组件

        this.popup = new Overlay({
          element: document.getElementById("popup"),
          autoPan: true,
          autoPanAnimation: {
            duration: 250
          }
        });

        this.map = new Map({
          interactions: defaultInteractions({doubleClickZoom: false}),
          target: 'map',
          layers: [],
          overlays: [this.popup],
          view: new View({
            center: this.mapConfig.center,
            zoom: this.mapConfig.zoom,
            projection: this.mapConfig.projection,
            maxZoom: this.mapConfig.maxZoom || 20,
            minZoom: this.mapConfig.minZoom || 5,
          })
        });
        this.lastZoom=this.mapConfig.zoom;
        if (this.showBaseMap) {
          let baseLayer = this.tile({id: "basemap"});
          //注记层
          /* let annotionLayer = new Tile({
               id: "annotionLayer",
               zIndex: 1,
               source: new XYZ({
                 url: this.annotionLayerUrl
               })
             });*/
          this.map.addLayer(baseLayer);
          // this.map.addLayer(annotionLayer);
        }
        //高亮图层
        let hightStyle = new Style({
          stroke: new Stroke({
            // color: '#ffee1d',
            color: "#23FCFF",
            width: 2
          }),
          fill: new Fill({
            // color: 'rgba(255,187,25,0.3)'
            color: 'rgba(37,252,255,0.3)'
          })
        });
        let highLightLayer = new VectorLayer({
          zIndex: 99,
          id: "searchHighLayer",
          style: hightStyle,
          source: new VectorSource(),
        })//高亮图层
        this.map.addLayer(highLightLayer);
        

        var styles = [
            new Style({
              stroke: new Stroke({
                  color: '#2096ff',
                  width: 3
              }),
            }),
        ];
        // console.log(areaData);
        var vectorSource = new VectorSource({
            features: (new GeoJSON()).readFeatures(areaData)
        });
        let yanchiAreaLayer = new VectorLayer({
            zIndex: 98,
            id: "areaLayer",
            source: vectorSource,
            style: styles,
            transparent:"true"
        });
        this.map.addLayer(yanchiAreaLayer);

        // Globel.map = this.map;
        window.map = this.map;
      },
      initProject4490: function () {
        proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
        register(proj4);
        this.project4490 = getProjection("EPSG:4490");
        this.project4490.setExtent([-180, -90, 180, 90])
      },
      tile: function (params) {
          this.baseLayerUrl = this.chinaProvider(params);
          let layer = new Tile({
              id: (params && params["id"]) || "basemap",
              zIndex: 0,
              source: new XYZ({
                  url: this.baseLayerUrl
              }),
              isBaseLayer:true
          });
        return layer;
      },
      chinaProvider(params) {
        var layers = {
          TianDiTu: {
              Normal: {
                  Map: "http://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=2ebb79bb2e8fe42366a8c949d28caf6d",
                  Annotion:
                      "http://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk=2ebb79bb2e8fe42366a8c949d28caf6d"
              },
              Satellite: {
                  Map: "http://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=2ebb79bb2e8fe42366a8c949d28caf6d",
                  Annotion: 
                      "http://t{0-7}.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk=2ebb79bb2e8fe42366a8c949d28caf6d"
              },
              Terrain: {
                  Map: "http://t{0-7}.tianditu.gov.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk=2ebb79bb2e8fe42366a8c949d28caf6d",
                  Annotion:
                      "http://t{0-7}.tianditu.gov.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk=2ebb79bb2e8fe42366a8c949d28caf6d"
              }
          },
        };
        var layersAMap = {
          aMap: {
              Normal: {
                  Map: "http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
                  Annotion:"http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
              },
              Satellite: {
                  Map: "https://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
                  Annotion: "http://webst0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8"
              },
              Terrain: {
                  Map: "http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
                  Annotion: "http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
              }
          },
        };
        var server = (params && params.server) || "aMap";
        var source = (params && params.source) || "Normal";
        var type = (params && params.type) || "Map";
        return layersAMap[server][source][type];

      },
      removeLayer(id) {
        var layers = this.map.getLayers().getArray();
        for (var i = 0; i < layers.length; i++) {
          var layerId = layers[i].get("id");
          if (id === layerId) this.map.removeLayer(layers[i]);
        }
      },
      getLayer(id) {
        var layers = this.map.getLayers().getArray();
        for (var i = 0; i < layers.length; i++) {
          var layerId = layers[i].get("id");
          if (id === layerId) return layers[i];
        }
      },
      changeBaseMapUrl(params) {
        this.baseLayerUrl = this.chinaProvider(params);
        params.type = "Annotion";
        this.annotionLayerUrl = this.chinaProvider(params);
      },
      addArcGISTileLayer(id, url, zindex,opacity=0.5) {
        let layer = new Tile({
          id,
          zIndex: zindex || 15,
          source: new TileArcGISRest({
            url: url
          })
        });
        layer.setOpacity(opacity);
        this.map.addLayer(layer);
      },
      addWMSLayer(id, layerName) {
        let layer = new Tile({
          id,
          zIndex: 15,
          source: new TileWMS({
            url: this.$globel.gisServerHost + '/wms/',
            params: {'LAYERS': layerName, 'TILED': false},
            serverType: 'geoserver',
            projection: 'EPSG:4326',
          })
        });
        this.map.addLayer(layer);
      },
      queryDataByPointWfs(point, layerId, callback) {
        let wkt = point[0] + "," + point[1];
        let FILTER = '<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">' +
          '<Intersects>' +
          '<PropertyName>geom</PropertyName>' +
          '<gml:Point>' +
          '<gml:coordinates>' + wkt + '</gml:coordinates>' +
          '</gml:Point>' +
          '</Intersects></Filter>';
        var options = {
          typename: layerId,//查询的服务图层名称
          filter: FILTER,//查询条件
          callback: 'getIdentifyroadGrid'//查询的回调函数
        };
        this.$axios.get(this.$globel.gisServerHost + '/wfs', {
          params: {
            service: 'WFS',
            version: '1.0.0',
            request: 'GetFeature',
            typename: options.typename,
            outputFormat: 'json',
            filter: options.filter
          }
        }).then(res => {
          callback(res);
        }).catch(e => {
          console.error(e);
        })
      },
      queryDataByPointArcGIS(point, layerName,outFields, callback) {
        this.$axios.get(this.$globel.url.fzArcGISUrl + layerName + "/MapServer/0/query", {
          params: {
            geometry: point[0] + "," + point[1],
            geometryType: 'esriGeometryPoint',
            spatialRel: 'esriSpatialRelIntersects',
            returnGeometry: true,
            returnTrueCurves: false,
            returnIdsOnly: false,
            returnCountOnly: false,
            outFields: outFields.join(","),
            f: 'pjson'
          }
        }).then(res => {
          callback(res);
        }).catch(e => {
          console.log(e);
        })
      },
      highLightGisData(feature) {
        let highLightLayer = this.getLayer("highLight");
        if (!highLightLayer) {
          //设置高亮图层样式
          let highlightStyle = new Style({
            stroke: new Stroke({
              color: '#f00',
              width: 2
            }),
            fill: new Fill({
              color: 'rgba(255,0,0,0.3)'
            }),
            text: new Text({
              font: '12px Calibri,sans-serif',
              fill: new Fill({
                color: '#000'
              }),
              stroke: new Stroke({
                color: '#f00',
                width: 3
              })
            })
          });
          highLightLayer = new VectorLayer({
            zIndex: 99,
            id: "highLight",
            style: highlightStyle,
            source: new VectorSource(),
          })
          this.map.addLayer(highLightLayer);
        }
        let vectorS = highLightLayer.getSource();
        vectorS.clear();
        vectorS.addFeature(feature);
      },
      highLightGisDatas(features, layerId, color) {
        let highLightLayer = this.getLayer(layerId);
        if (!highLightLayer) {
          let style = new Style({
            stroke: new Stroke({
              // color: '#ffee1d',
              color: color.borderColor,
              width: 2
            }),
            fill: new Fill({
              // color: 'rgba(255,187,25,0.3)'
              color: color.fillColor
            })
          });
          highLightLayer = new VectorLayer({
            zIndex: 99,
            id: layerId,
            style: style,
            source: new VectorSource(),
          })//高亮图层
          this.map.addLayer(highLightLayer);
        }
        let vectorS = highLightLayer.getSource();
        vectorS.clear();
        vectorS.addFeatures(features);
      },
      queryPropertyByFilter(filter, layerId, callback) {
        var options = {
          typename: layerId,//查询的服务图层名称
          filter: filter,//查询条件
          callback: 'getIdentifyroadGrid'//查询的回调函数
        };
        this.$axios.post(this.$globel.gisServerHost + '/wfs', /*{params:{
            service: 'WFS',
            version: '1.0.0',
            request: 'GetFeature',
            typename: options.typename,
            outputFormat: 'json',
            filter:options.filter
          }}*/
          Qs.stringify({
            service: 'WFS',
            version: '1.0.0',
            request: 'GetFeature',
            typename: options.typename,
            outputFormat: 'json',
            filter: options.filter
          })
        ).then(res => {
          callback(res);
        }).catch(e => {
          console.error(e);
        })
      },
      showPopup(title, coordinate, popupId) {
        this.popupTitle = title;
        // this.popupId=popupId;
        this.popup.setPosition(coordinate);
      },
      closePopup() {
        this.popup.setPosition(undefined);
      },
      queryDataByPolygonWfs(feature, layerId, callback) {
        let str = feature.getGeometry().getCoordinates()[0].join(" ");
        let FILTER = '<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">' +
          '<Intersects>' +
          '<PropertyName>geom</PropertyName>' +
          '<gml:Polygon>' +
          '<gml:outerBoundaryIs>' +
          '<gml:LinearRing>' +
          '<gml:coordinates>' + str + '</gml:coordinates>' +
          '</gml:LinearRing>' +
          '</gml:outerBoundaryIs>' +
          '</gml:Polygon>' +
          '</Intersects></Filter>';
        var options = {
          typename: layerId,//查询的服务图层名称
          filter: FILTER,//查询条件
          callback: 'getIdentifyroadGrid'//查询的回调函数
        };
        this.$axios.get('http://localhost:6080/arcgis/services/fz/fzhistory/MapServer/WFSServer', {
          params: {
            service: 'WFS',
            version: '1.1.0',
            request: 'GetFeature',
            typename: options.typename,
            outputFormat: 'json',
            filter: options.filter
          }
        }).then(res => {
          callback(res);
        }).catch(e => {
          console.error(e);
        })
      },
      drawPolygon(layerId, callback) {
        let polygonStyle = new Style({
          fill: new Fill({
            color: 'rgba(255, 195, 76, 0.2)'
          }),
          stroke: new Stroke({
            color: '#fff722',
            width: 2
          })
        });
        //判断图层是否存在
        let layer = this.getLayer(layerId);
        if (!layer) {
          //设置高亮图层样式
          layer = new VectorLayer({
            zIndex: 98,
            id: layerId,
            style: polygonStyle,
            source: new VectorSource(),
          })
          this.map.addLayer(layer);
        }
        let vectorS = layer.getSource();
        this.drawInteraction = new Draw({
          source: vectorS,
          type: "Polygon"
        });
        this.map.addInteraction(this.drawInteraction);
        this.drawInteraction.on('drawend', e => {
          this.map.removeInteraction(this.drawInteraction);
          callback(e);
        }, this);

      },
      stopDraw() {
        if (this.drawInteraction) {
          this.map.removeInteraction(this.drawInteraction);
        }
      },
      getBuildingByArcGIS(url, condition, callback, error) {
        this.$axios.get(url, {
          params: {
            where: condition.where || '1=1',
            geometry: condition.geometry || '',
            geometryType: condition.geometryType || 'esriGeometryPoint',
            outFields: condition.outFields || "*",
            returnGeometry: condition.returnGeometry || 'true',
            f: "json"
          }
        }).then(res => {
          callback(res)
        }).catch(e => {
          if (error) {
            error(e)
          } else {
            console.log(e);
          }
        })
      },
      addPointLayer(pointFeatures, symbolUrl, layerId) {
        let layer = this.getLayer(layerId);
        if (!symbolUrl) {
          // switch pointFeatures
        }
        let style = new Style({
          image: new Icon({
            anchor: [0.5, 0.5],
            src: symbolUrl,
//             imgSize:[14,14],
//             size:[14,14]
          })
        });
        if (!layer) {
          //设置高亮图层样式
          layer = new VectorLayer({
            zIndex: 98,
            id: layerId,
            style: style,
            source: new VectorSource(),
          })
          this.map.addLayer(layer);
        }
        layer.getSource().clear();
        layer.getSource().addFeatures(pointFeatures);
      },
      hideLayer(layerId) {
        let layer = this.getLayer(layerId);
        if (layer) layer.setVisible(false)
      },
      showLayer(layerId) {
        alert(layerId)
        let layer = this.getLayer(layerId)
        if (layer) layer.setVisible(true);
      },
      drawBuildingPointClustersLayer(data, layerId) {

        let features = [];
        for (let p of data) {
          let point = new Point([parseFloat(p.bdr_x), parseFloat(p.bdr_y)]);
          let feature = new Feature({geometry: point});
          let symbolUrl = "";
          switch (p.bdr_is_history_build) {
            case 0:
              symbolUrl = "./static/img/map/yard.png"
              break;
            default:
              symbolUrl = "./static/img/map/yard4.png"
              break;
          }
          let style = new Style({
            image: new Icon({
              anchor: [0.5, 0.5],
              src: symbolUrl,
              // imgSize:[14,14],
              // size:[14,14]
            })
          });
          feature.setId(p.lsjzxh);
          feature.setProperties(p);
          feature.setStyle(style);
          features.push(feature);
        }
        let layer = this.getLayer(layerId);
        //聚合
        let source=new VectorSource();
        source.clear();
        source.addFeatures(features);
        var clusterSource = new Cluster({
          distance: 50,
          source: source
        });
        if (!layer) {
          //设置高亮图层样式
          layer = new VectorLayer({
            zIndex: 98,
            id: layerId,
            source: clusterSource,
            style: function(feature) {
              var size = feature.get('features').length;
              // var style = styleCache[size];
              let style=null;
              if(size>1){
                  style = new Style({
                    image: new CircleStyle({
                      radius: 20,
                      stroke: new Stroke({
                        color: '#fff'
                      }),
                      fill: new Fill({
                        color: '#cc9f34'
                      })
                    }),
                    text: new Text({
                      text: size.toString(),
                      fill: new Fill({
                        color: '#fff'
                      })
                    })
                  });
                }else{
                style=feature.get('features')[0].getStyle();
              }
              return style;
            }
          })
          this.map.addLayer(layer);
        }else{
          layer.setSource(clusterSource);
        }

        // layer.getSource().clear();
        // layer.getSource().addFeatures(features);
        return features;
      },
      drawBuildingPointLayer(data, layerId,clearFlag=true) {

        let features = [];
        for (let p of data) {
          let point = new Point([parseFloat(p.bdr_x), parseFloat(p.bdr_y)]);
          let feature = new Feature({geometry: point});
          let symbolUrl = "";
          switch (p.bdr_is_history_build) {
            case 0:
              symbolUrl = "./static/img/map/yard.png"
              break;
            default:
              symbolUrl = "./static/img/map/yard4.png"
              break;
          }
          let style = new Style({
            image: new Icon({
              anchor: [0.5, 0.5],
              src: symbolUrl,
              // imgSize:[14,14],
              // size:[14,14]
            })
          });
          feature.setId(p.lsjzxh);
          feature.setProperties(p);
          feature.setStyle(style);
          features.push(feature);
        }
        let layer = this.getLayer(layerId);
        let source=null;
        if (!layer) {
          source=new VectorSource();
          //设置高亮图层样式
          layer = new VectorLayer({
            zIndex: 98,
            id: layerId,
            source: source,
          })
          this.map.addLayer(layer);
        }else{
          source=layer.getSource();
        }

        if(clearFlag) source.clear();

        source.addFeatures(features);


        // layer.getSource().clear();
        // layer.getSource().addFeatures(features);
        return features;
      },
      drawEnvironmentLayar(res, layerId, symbolUrl) {
        if (!res.error) {
          let features = [];
          for (let p of res.data.features) {
            let point = new Point([parseFloat(p.attributes.x), parseFloat(p.attributes.y)]);
            let feature = new Feature({geometry: point});
            feature.setId(p.attributes.lsjzxh || p.attributes.ObjectID);
            feature.setProperties(p.attributes);
            features.push(feature);
          }

          this.addPointLayer(features, symbolUrl, layerId);
        }
      },
      initZoomEvent() {
        this.map.on('postcompose', e => {
          for (let layer of this.showLayers) {
            switch (layer.id) {
              case "fzhistory_building":
                if (layer.show) {
                  if (this.map.getView().getZoom() < 16) {
                    this.showLayer('fzhistory_building_point');
                    this.showLayer('fzhistory_building_cluster');
                    this.hideLayer('fzhistory_single');
                    this.hideLayer('fzhistory_single_border');
                    this.hideLayer('fzhistory_yard');
                    this.hideLayer('fzhistory_yard_border');
                  } else {
                    this.showLayer('fzhistory_single');
                    this.showLayer('fzhistory_single_border');
                    this.showLayer('fzhistory_yard');
                    this.showLayer('fzhistory_yard_border');
                    this.hideLayer('fzhistory_building_point');
                    this.hideLayer('fzhistory_building_cluster');
                  }
                } else {
                  this.hideLayer('fzhistory_yard');
                  this.hideLayer('fzhistory_yard_border');
                  this.hideLayer('fzhistory_single');
                  this.hideLayer('fzhistory_single_border');
                  this.hideLayer('fzhistory_building_point');
                  this.hideLayer('fzhistory_building_cluster');
                }
                if(this.lastZoom!=e.target.getView().getZoom() ){
                  let blayer=this.getLayer("fzhistory_building_point");
                  if(blayer){
                    blayer.getSource().clear()
                  }
                  this.lastZoom=e.target.getView().getZoom();
                }

                break;
              case "environment_feature":
                if (layer.show) {
                  if (this.map.getView().getZoom() < 16) {
                    this.showLayer('environment_feature_point');
                    this.hideLayer('environment_feature');
                  } else {
                    this.showLayer('environment_feature');
                    this.hideLayer('environment_feature_point');
                  }
                } else {
                  this.hideLayer('environment_feature');
                  this.hideLayer('environment_feature_point');
                }
                break;
            }

          }
          if (e.target.getView().getZoom() < 16) {
            this.hideLayer('searchHighLayer');
          } else {
            this.showLayer('searchHighLayer');
          }
        })
      },
      removeAllLayer: function (excludeLayers) {
        var layers = this.map.getLayers().getArray();
        for (var i = 0; i < layers.length; i++) {
          var layerId = layers[i].get("id");
          if (excludeLayers.indexOf(layerId) < 0) {
            this.map.removeLayer(layers[i]);
            i--;
          }
        }
      },
      getExtent(features) {
        let minX, minY, maxX, maxY;
        for (let i = 0; i < features.length; i++) {
          let geometry = features[i].getGeometry();
          let point;
          switch (geometry.getType()) {
            case "Polygon":
              point = geometry.getInteriorPoint().getCoordinates()
              if (i === 0) {
                minX = point[0];
                maxX = point[0];
                minY = point[1];
                maxY = point[1];
              }
              if (minX > point[0]) minX = point[0];
              if (minY > point[1]) minY = point[1];
              if (maxX < point[0]) maxX = point[0];
              if (maxY < point[1]) maxY = point[1];
              break;
            case "Point":
              point = geometry.getCoordinates()
              if (i === 0) {
                minX = point[0];
                maxX = point[0];
                minY = point[1];
                maxY = point[1];
              }
              if (minX > point[0]) minX = point[0];
              if (minY > point[1]) minY = point[1];
              if (maxX < point[0]) maxX = point[0];
              if (maxY < point[1]) maxY = point[1];
              break;
          }

        }
        return [minX, minY, maxX, maxY];
      }
    },

    mounted() {
      // this.initProject4490();
      this.initMap();
      // this.initZoomEvent();
    },

  }
</script>

<style lang="less" type="text/less" scoped>
  .map-container, #map {
    width: 100%;
    height: 100%;
  }

</style>
