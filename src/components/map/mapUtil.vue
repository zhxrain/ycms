<script type="text/javascript">
// import Globel from "@/components/globel";
import axios from "axios";
let oldFea = null; //选中的企业图标；
let hoverFea = null; //悬浮；

let zoomdraw;
let $axios = axios;
export default {
  zoomdraw,
  $axios,
  //    queryDataByWfs(bgcode,lev,isGrade,callback){
  queryDataByWfs(layerSrcName, paramsKey, paramsValue, callback) {
    var typename = layerSrcName;
    var FILTER =
      '<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">' +
      "<And>" +
      "<PropertyIsEqualTo>" +
      "<PropertyName>" +
      paramsKey +
      "</PropertyName>" +
      "<Literal>" +
      paramsValue +
      "</Literal>" +
      "</PropertyIsEqualTo>" +
      "</And></Filter>";
    var options = {
      typename: typename, //查询的服务图层名称
      filter: FILTER, //查询条件
      callback: "getIdentifyroadGrid" //查询的回调函数
    };

    this.$axios
      .get(this.$globel.gisServerHost + "geoserver/wfs", {
        params: {
          service: "WFS",
          version: "1.0.0",
          request: "GetFeature",
          typename: options.typename,
          outputFormat: "json",
          filter: options.filter
        }
      })
      .then(res => {
        if (typeof callback == "function") {
          callback(res.data);
        }
      })
      .catch(e => {
        console.log(e);
      });

  },
  setDefaultMap() {
    window.map.getView().animate({
      center: [14069114.727370387, 5363098.62736998],
      zoom: 6.7,
      duration: 500
    });
  },
  zoombGeoJson(json, lev) {
    var zoom = lev == 1 ? 9 : lev == 2 ? 12 : 7;
    var features = new ol.format.GeoJSON().readFeatures(json);

    var feature = features[0];
    if (feature) {
      var coor = feature
        .getGeometry()
        .getInteriorPoints()
        .getCoordinates()[0];
      window.map.getView().setCenter(
        feature
          .getGeometry()
          .getInteriorPoints()
          .getCoordinates()[0]
      );
    }
    window.map.getView().animate({
      zoom: zoom,
      duration: 500
    });
  },
  getTreeTreeLayer(id) {
    // 根据id获取vertor图层
    var rtValue = undefined;
    var layers = window.map.getLayers().getArray();
    for (var key in layers) {
      var layerId = layers[key].get("id");
      if (layerId === id) rtValue = layers[key];
    }
    return rtValue;
  },
  createGradeMianLayer(geoJson, gradeData, layerId, isJw, isShow, zIndex) {
    this.removeLayer(layerId);
    var features = new ol.format.GeoJSON().readFeatures(geoJson, {
      dataProjection: "EPSG:4326",
      featureProjection: isJw ? "EPSG:3857" : "EPSG:4326"
    });
    // [{grade: 4, bgcode: "22032200000000", level1: "4"}];

    var vectorSource = new ol.source.Vector({
      features: features
    });
    var colors = [
      "rgba(253, 108, 96, 0.41)",
      "rgba(255, 176, 0, 0.41)",
      " rgba(253, 215, 0, 0.3)",
      "rgba(66, 155, 249, 0.3)"
    ];
    var colors2 = [
      "rgba(253, 108, 96, 1)",
      "rgba(255, 176, 0, 1)",
      " rgba(253, 215, 0, 1)",
      "rgba(66, 155, 249, 1)"
    ];
    var vectorLayer = new ol.layer.Vector({
      id: layerId,
      source: vectorSource,
        maxResolution:2600,
      style: function(feature) {
        var bgcode = feature.getProperties().BGCODE;
        var name = feature.getProperties().NAME;
        var level = 3;
        for (var m = 0; m < gradeData.length; m++) {
          if (gradeData[m].regionid+'000000' == bgcode) {
            level = Number(gradeData[m].risklevel) - 1;
          }
        }
        var style = new ol.style.Style({
          fill: new ol.style.Fill({
            //矢量图层填充颜色，以及透明度
            color: colors[level]
          }),
          stroke: new ol.style.Stroke({
            //边界样式
            color: "#fff",
            width: 1
          }),
          text: new ol.style.Text({
            text: name,
            fill: new ol.style.Fill({
              // color: "#007cff",
              color: "#000",
              width: 1
            }),
            font: "14px Microsoft YaHei bold"
          })
        });
        return style;
      }
    });
    vectorLayer.setZIndex(zIndex);
    var extent = vectorLayer.getSource().getExtent(); //合适比例缩放居中;
    var view = window.map.getView();
    view.fit(extent, {
      size: window.map.getSize(),
      duration: 1000
    });
    vectorLayer.setVisible(isShow);
    window.map.addLayer(vectorLayer);
  },
  createPolyMianLayer(geoJson, layerId, isJw, isShow, zIndex) {
    var layer = this.getTreeLayer(layerId);
    if (layer) {
      window.map.removeLayer(layer);
    }
    var pl1 = new ol.proj.Projection({ code: "EPSG:4326" });
    var pl2 = new ol.proj.Projection({ code: "EPSG:3857" });

    var features = new ol.format.GeoJSON().readFeatures(geoJson, {
      dataProjection: "EPSG:4326",
      featureProjection: isJw ? "EPSG:3857" : "EPSG:4326"
    });
    var vectorSource = new ol.source.Vector({
      features: features
    });
    // var colors = ["rgba(141, 193, 250, 0.2)", "rgba(15, 138, 133, 0.2)", "rgba(116, 199, 227, 0.2)", "rgba(55, 206, 255, 0.2)",
    //     "rgba(66, 155, 249, 0.2)", "rgba(49, 159, 226, 0.2)", "rgba(141, 193, 250, 0.2)", "rgba(15, 138, 133, 0.2)", "rgba(116, 199, 227, 0.2)", "rgba(55, 206, 255, 0.2)"];
    var colors = [
      "rgba(251, 153, 0, 0.4)",
      "rgba(105, 194, 96, 0.4)",
      "rgba(87, 159, 255, 0.4)",
      "rgba(250, 100, 103, 0.4)",
      "rgba(173, 122, 225, 0.4)",
      "rgba(251, 153, 0, 0.4)",
      "rgba(105, 194, 96, 0.4)",
      "rgba(87, 159, 255, 0.4)",
      "rgba(250, 100, 103, 0.4)",
      "rgba(173, 122, 225, 0.4)"
    ];

    var vectorLayer = new ol.layer.Vector({
      id: layerId,
      source: vectorSource,
      style: function(feature) {
        var code = feature.getId();
        var name = feature.getProperties().NAME;
        var lastNum = code.substr(code.length - 1);
        if (code.indexOf("fangWu3857") > -1) {
          var style = new ol.style.Style({
            fill: new ol.style.Fill({
              //矢量图层填充颜色，以及透明度
              color: "#FFB000"
            }),
            stroke: new ol.style.Stroke({
              //边界样式
              color: "rgba(179, 163, 55, 0.9)",
              width: 1
            })
          });
        } else if (code.indexOf("LianHS_border3857") > -1) {
          var style = new ol.style.Style({
            fill: new ol.style.Fill({
              //矢量图层填充颜色，以及透明度
              color: "rgba(60, 152, 252, 0.20)"
            }),
            stroke: new ol.style.Stroke({
              //边界样式
              color: "#3B90E6",
              width: 2,
              lineDash: [5, 5],
              lineDashOffset: 50
            })
          });
        } else {
          var style = new ol.style.Style({
            fill: new ol.style.Fill({
              //矢量图层填充颜色，以及透明度
              color: colors[lastNum]
            }),
            stroke: new ol.style.Stroke({
              //边界样式
              color: " #fff",
              width: 1
            })
          });
        }
        return style;
      }
    });
    vectorLayer.setZIndex(zIndex);
      window.map.addLayer(vectorLayer);
    var zoom = window.map.getView().getZoom();
    if (zoom >= 11) {
      vectorLayer.setVisible(false);
    } else {
      vectorLayer.setVisible(isShow);
    }
  },

  featureBackColor(isHover) {
    if (oldFea) {
      // oldFea.ge
      var obj = oldFea.getProperties().features
        ? oldFea.getProperties().features[0].getProperties()
        : oldFea.getProperties();

      let risklevel = 4;

      if (obj.risklevel && obj.risklevel > 0 && obj.risklevel <= 4) {
        risklevel = parseInt(obj.risklevel);
      }

      var stylyBlue = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          zIndex: 0,
          // src:"./static/assets/event/grade" + level + ".png"

          src: "./static/assets/event/grade" + risklevel + ".png"
        })
      });
      oldFea.setStyle(stylyBlue);
    }
    if (hoverFea) {
      var obj = hoverFea.getProperties().features
        ? hoverFea.getProperties().features[0].getProperties()
        : hoverFea.getProperties();

      let risklevel = 4;
      if (obj.risklevel && obj.risklevel > 0 && obj.risklevel <= 4) {
        risklevel = parseInt(obj.risklevel);
      }

      var stylyBlue = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          zIndex: 0,
          // src:"./static/assets/event/grade" + level + ".png"

          src: "./static/assets/event/grade" + risklevel + ".png"
        })
      });
      // console.log(obj);
      hoverFea.setStyle(stylyBlue);
    }
  },
  featureChangeColor(layerId, id, isHover) {
    let stylyRed = new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 0.5],
        src: "./static/assets/img/location_red_small.png"
      }),
      zIndex: 1
    });

    let qiYiFeatures = this.qiYiFeatures;

    if (oldFea && !isHover) {
      // oldFea.ge
      var obj = oldFea.getProperties().features
        ? oldFea.getProperties().features[0].getProperties()
        : oldFea.getProperties();

      let risklevel = 4;
      if (obj.risklevel && obj.risklevel > 0 && obj.risklevel <= 4) {
        risklevel = parseInt(obj.risklevel);
      }

      var stylyBlue = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          zIndex: 0,
          // src:"./static/assets/event/grade" + level + ".png"

          src: "./static/assets/event/grade" + risklevel + ".png"
        })
      });
      // console.log(obj);
      oldFea.setStyle(stylyBlue);
    }
    if (hoverFea && isHover) {
      var obj = hoverFea.getProperties().features
        ? hoverFea.getProperties().features[0].getProperties()
        : hoverFea.getProperties();

      let risklevel = 4;
      if (obj.risklevel && obj.risklevel > 0 && obj.risklevel <= 4) {
        risklevel = parseInt(obj.risklevel);
      }

      var stylyBlue = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          zIndex: 0,
          // src:"./static/assets/event/grade" + level + ".png"

          src: "./static/assets/event/grade" + risklevel + ".png"
        })
      });
      hoverFea.setStyle(stylyBlue);
    }
    if (id) {
      let l = this.getTreeLayer(layerId);
      let feature = l.getSource().getFeatureById(id);
      if (feature) {
        feature.setStyle(stylyRed);
        oldFea = feature;
        if (isHover) {
          hoverFea = feature;
        }
      }
    }
  },
  addCompanyPoint(layerId, res, index, needAnimate) {
    //  return;
    var l = this.getTreeLayer(layerId);
    let map = window.map;
    if (l) map.removeLayer(l);
    var features = new Array();
    // 地图上加点，这里开始
    var event_url;
    for (var i = 0; i < res.length; i++) {
      var obj = res[i];
      var geom = res[i].geom;
      if (geom) {
        var coors = geom.replace(/POINT\(|\)/g, "").split(" ");
        let lang = parseFloat(coors[0]);
        let lat = parseFloat(coors[1]);
        var p = new ol.geom.Point([lang, lat]);

        let risklevel = 4;
        if (obj.risklevel && obj.risklevel > 0 && obj.risklevel <= 4) {
          risklevel = parseInt(obj.risklevel);
        }
        // console.log(risklevel);

        var style = new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 0.5],
            // src:"./static/assets/event/grade" + level + ".png"

            src: "./static/assets/event/grade" + risklevel + ".png"
          })
        });
        var feature = new ol.Feature({ geometry: p });
        feature.setProperties(obj);
        feature.setStyle(style);
        feature.setId(obj.id);
        features.push(feature);
      }
    }
    this.qiYiFeatures = features;
    var vectorSource = new ol.source.Vector({
      features: features
    });
    var vectorLayer = new ol.layer.Vector({
      id: layerId,
      source: vectorSource,
      style: function(feature) {
        var style = feature.getProperties().features[0].getStyle();
        return style;
      }
    });
    vectorLayer.setZIndex(index);

    var extent = vectorSource.getExtent(); //合适比例缩放居中;
    var view = map.getView();
    if (needAnimate) {
      view.fit(extent, {
        size: map.getSize(),
        duration: 500
      });
    }

    map.addLayer(vectorLayer);
  },
  createPointLayer: function(layerId, res, index) {
    // this.removeAllLayer();
    var l = this.getTreeLayer(layerId);
    if (l) window.map.removeLayer(l);
    var features = new Array();
    // 地图上加点，这里开始
    var event_url;
    for (var i = 0; i < res.length; i++) {
      var obj = res[i];
      var geom = res[i].geom;
      if (geom) {
        var coors = geom.replace(/POINT\(|\)/g, "").split(" ");
        let lang = parseFloat(coors[0]);
        let lat = parseFloat(coors[1]);
        var p = new ol.geom.Point([lang, lat]);
      }
      var level = obj.level ? obj.level : "1";
      var style = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          src: "./static/assets/event/grade" + level + ".png"
        })
      });
      var feature = new ol.Feature({ geometry: p });
      feature.setProperties(obj);
      feature.setStyle(style);
      feature.setId(obj.id);
      features.push(feature);
    }
    var vectorSource = new ol.source.Vector({
      features: features
    });
    var clusterSource = new ol.source.Cluster({
      distance: 40,
      source: vectorSource
    });
    // console.log(clusterSource);
    var vectorLayer = new ol.layer.Vector({
      id: layerId,
      style: function(feature) {
        var size = feature.get("features").length;
        var text = size > 1 ? size.toString() : "";
        if (size > 1) {
          var style = new ol.style.Style({
            image: new ol.style.Circle({
              radius: 25,
              fill: new ol.style.Fill({
                color: "rgba(66,155,249, 0.8)"
              }),
              stroke: new ol.style.Stroke({
                color: "rgba(66,155,249, 0.8)",
                width: 1
              })
            }),
            text: new ol.style.Text({
              text: text,
              fill: new ol.style.Fill({
                color: "#fff"
              }),
              offsetX: 0,
              offsetY: 0,
              font: "14px Microsoft YaHei "
            })
          });
        } else {
          var style = feature.getProperties().features[0].getStyle();
        }
        return style;
      }
    });
    // 这里结束
    vectorLayer.setSource(null);
    vectorLayer.setSource(clusterSource);
    vectorLayer.setZIndex(index);
    vectorLayer.setVisible(true);
      window.map.addLayer(vectorLayer);
    //  console.log(ol.control);
  },
  removeAllLayer: function(excludeLayers) {
    var layers = window.map.getLayers().getArray();
    for (var i = 0; i < layers.length; i++) {
      var layerId = layers[i].get("id");
      if (excludeLayers.indexOf(layerId)<0) {
          window.map.removeLayer(layers[i]);
        i--;
      }
    }
  },
  getLayer(id){
    var layers = window.map.getLayers().getArray();
    for (var i = 0; i < layers.length; i++) {
      var layerId = layers[i].get("id");
      if (id === layerId) return layers[i];
    }
  },
  removeLayer(id) {
    var layers = window.map.getLayers().getArray();
    for (var i = 0; i < layers.length; i++) {
      var layerId = layers[i].get("id");
      if (id === layerId) window.map.removeLayer(layers[i]);
    }
  },
  setLayerVisible: function(id, lv) {
    var ckLayer = this.getTreeLayer(id);
    if (ckLayer) {
      ckLayer.setVisible(lv);
    }
  },
  showLayer(layer) {
    layer.setVisible(true);
  },
  tile: function(params) {
   /* this.chinaProvider(params);
    var layer = new ol.layer.Tile({
      id: (params && params["id"]) || "basemap",
      source: new ol.source.XYZ({
        url: this.baseLayerUrl
      })
    });
    return layer;*/
    let projection = getProjection('EPSG:4326');
    let projectionExtent = projection.getExtent();
    debugger;
    let size = getWidth(projectionExtent) / 256;
    /* let resolutions = [];
     let matrixIds = [];
     for (var z = 0; z < 20; ++z) {
       resolutions[z] = size / Math.pow(2, z);
       matrixIds[z] = z;
     }*/

    let resolutions = [
      0.00274658203125,
      0.001373291015625,
      0.0006866455078125,
      0.00034332275390625,
      0.000171661376953125,
      0.0000858306884765625,
      0.00004291534423828125,
      0.000021457672119140625,
      0.000010728836059570312,
      0.000005364418029785156,
      0.000002682209014892578,
      0.000001341104507446289
    ];
    //瓦片矩阵
    let matrixIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11];
    this.baseLayerUrl = this.chinaProvider(params);
    let layer = new Tile({
      id: (params && params["id"]) || "basemap",
      zIndex: 0,
      /*source: new XYZ({
        url: this.baseLayerUrl
      })*/
      source: new WMTS({
        url: 'http://tdt.fuzhou.gov.cn/serviceaccess/WMTS/Vector2012CGCS2000?',
        layer: 'Vector2012CGCS2000',
        matrixSet: 'sss',
        format: 'image/png',
        projection: projection,
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds
        }),
        style: 'default',
        wrapX: true
      })
    });
    return layer;
  },
  createTile: function(zIndex) {
    //加上行政区图层
    var url =
      "http://219.149.226.180:6080/arcgis/rest/services/anjian/jilincity/MapServer";
    var layer = new ol.layer.Tile({
      id: "xzqLayer",
      source: new ol.source.TileArcGISRest({
        url: url
      }),
      zIndex: zIndex ? zIndex : 0,
      minResolution:120,
      // maxResolution:2600,
    });
    return layer;
  },
  chinaProvider(params) {
    var layers = {
      TianDiTu: {
        Normal: {
          Map: "http://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}",
          Annotion:
            "http://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}"
        },
        Satellite: {
          Map: "http://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}",
          Annotion:
            "http://t{0-7}.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}"
        },
        Terrain: {
          Map: "http://t{0-7}.tianditu.gov.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}",
          Annotion:
            "http://t{0-7}.tianditu.gov.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}"
        }
      },

      MapABC: {
        Normal: {
          Map: "http://emap{0-3}.mapabc.com/mapabc/maptile?&x={x}&y={y}&z={z}"
        }
      },

      GaoDe: {
        Normal: {
          Map:
            "http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
        },
        Satellite: {
          Map:
            "http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
          Annotion:
            "http://webst0{1-4}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}"
        }
      },
      Google: {
        Normal: {
          Map:
            "http://mt{0-3}.google.cn/vt/lyrs=p@258000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Ga"
        },
        Satellite: {
          Map:
            "http://mt{0-3}.google.cn/vt/lyrs=y@258000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Ga"
        }
      }
    };
    var server = (params && params.server) || "Google";
    var source = (params && params.source) || "Normal";
    var type = (params && params.type) || "Map";
    //        return layers[server][source][type];
    this.baseLayerUrl = layers[server][source][type];
  }
};
</script>
