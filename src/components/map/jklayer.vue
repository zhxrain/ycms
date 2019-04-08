<template>
     <div id="jk_popup" class="jk_ol-popup"  ref="jkpopup">
       <a href="#" id="jk_popup-closer" class="jk_ol-popup-closer" @click.stop.prevent='hidejkPopup($event)'></a>
         <div id="jk_popup-content">
           <div class="jk_layer-title" ref="jklayertitle">{{title}}
             <i v-show="menuShow"  class="icon iconfont icon-caidan menu" @click.stop="showMenu"></i>
             </div>
           <div class="toMax"></div><div class="min-swi"></div>
             <div class="jk_layer-container">
               <div class="notFullHeight"  id="jk_pop-iframe">
                    <router-view></router-view>
               </div>
                </div><div href="#" class="jk_layer-max" id="jk_layer-max">查看详情</div>
           </div>
           </div>
</template>
<script>
// import Globel from '@/components/globel'
import MapUtil from '@/components/map/mapUtil.vue'
// import { startDrag } from "../../../static/lib/drag.js";
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      con: 'map',
      params: '',
      menuShow: false
    }
  },
  computed: {
    title: function () {
      // console.log(this.$store.state.showJklayerParams.name);
      var n = this.$store.state.storeMap.showJklayerParams.name
        ? this.$store.state.storeMap.showJklayerParams.name
        : '企业标准卡片'
      return n
    }
  },
  watch: {
    '$store.state.storeMap.showJklayerParams': function (val, old) {
      var p = val
      this.params = p
      var s = this.params.showJklayer
      var dom_jk_popup = this.$refs['jkpopup']
      // console.log(dom_jk_popup);
      if (s && dom_jk_popup) {
        var opts = Object.assign({}, p)
        this.open(opts)
      }
    }
  },
  mounted () {
    let _this = this
  },
  methods: {
    showMenu () {
      let _this = this,
        m = $('.card-view').hasClass('menu-show')
      $('.card-view,.card-sideNav').toggleClass('menu-show')
      _this.$store.dispatch('mapresize', m)
    },
    updateJklayer () {
      var p = this.$store.state.storeMap.showJklayerParams
      this.params = p
      var s = this.params.showJklayer
      var dom_jk_popup = this.$refs['jkpopup']
      if (s && dom_jk_popup) {
        var opts = Object.assign({}, p)
        this.open(opts)
      }
    },
    open: function (options) {
      var defaluts = {
        title: '',
        url: '',
        area: ['416px', '560px'],
        bindData: function () {},
        success: function () {},
        cancel: function () {}
      }
      var opts = $.extend({}, defaluts, options)
      this.opts = opts
      // console.log(opts);
      this.init()
    },
    init: function (container) {
      var that = this
      that.resetClass()
      that.createPop()
      that.createDom()
    },
    resetClass () {
      $('.toMax').removeClass('toSmall')
      $('#jk_popup').removeClass('max')
      $('#jk_layer-max')
        .removeClass('jk_layer-min')
        .addClass('jk_layer-max')
      $('#jk_pop-iframe').removeClass('fullHeight')
      this.menuShow = false
    },
    hidejkPopup (event) {
      if (event && event.target) {
        event.target.blur()
      }
      this.jk_popup.setPosition(undefined)
      $('.toMax').removeClass('toSmall')
      $('#jk_popup').removeClass('max')
      $('#jk_layer-max')
        .removeClass('jk_layer-min')
        .addClass('jk_layer-max')
      $('#jk_pop-iframe').removeClass('fullHeight')
      this.menuShow = false
      this.$store.dispatch('showjklayer', { showJklayer: false })
      var storage = window.sessionStorage
      sessionStorage.clear()
      MapUtil.featureBackColor()
      MapUtil.oldFea = null
    },
    createPop: function (container) {
      // 创建弹窗专用的popupDom
      // console.log("是否有dom元素", document.getElementById("jk_popup"));
      // alert(!!this.jk_popup);
      // this.jk_popup

      // console.log( Globel.map.getOverlayById("jk_overLayer"));
      let l = window.map.getOverlayById('jk_overLayer')
      // if(l){
      //     Globel.map.removeOverlay(l);
      //      this.jk_popup = "";
      //   }else{

      //   }
      // console.log(l);
      if (!l) {
        var jk_popup = new ol.Overlay({
          element: document.getElementById('jk_popup'),
          id: 'jk_overLayer',
          positioning: 'bottom-center',
          autoPan: false,
          stopEvent: true
        })
        window.map.addOverlay(jk_popup)
        this.jk_popup = jk_popup
      }
      // console.log(this.jk_popup.getElement());
      // console.log(Globel.map.getOverlays().getLength());
      window.map.getView().animate({
        center: this.opts.point,
        zoom: 15,
        duration: 0
      })
      this.jk_popup.setPosition(this.opts.point)
      // this.commonAnimation("#jk_popup", "zoomIn");
      // var pixel = Globel.map.getPixelFromCoordinate(this.opts.point);
      // console.log(pixel);
    },
    createDom: function () {
      var url = '/jklayer' + this.opts.url
      // console.log(url);
      // this.$router.push({ path: url });
      this.resetStyle()
      // this.bindData(iframe);
      this.bindEvent()
    },
    commonAnimation: function (select, name) {
      $(select)
        .removeClass('animated')
        .addClass(name + ' animated')
        .one(
          'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
          function () {
            $(this).removeClass(name + ' animated')
          }
        )
    },
    resetStyle: function () {
      $('#jk_popup').css({
        width: this.opts.area[0],
        height: this.opts.area[1],
        display: 'block'
      })
      // 更改pop的offset；
      var offset = [22, parseInt(this.opts.area[1]) / 2]
      this.jk_popup.setOffset(offset)
      $('#jk_popup #jk_layer-max').show()
      $('#jk_pop-iframe').removeClass('fullHeight')
    },
    bindData: function (iframe) {
      if (typeof this.opts.bindData === 'function') {
        this.opts.bindData(iframe)
      }
    },
    setPosition: function (point) {
      if (!this.overLayer) {
        this.overLayer = this.map.getOverlayById('jk_overLayer')
      }
      this.overLayer.setPosition(point)
    },
    bindEvent: function () {
      var that = this
      $('#jk_pop-iframe')
        .addClass('notFullHeight')
        .removeClass('fullHeight')
      $('#jk_layer-max,.toMax')
        .off()
        .click(function (e) {
          e.stopPropagation()
          e.preventDefault()
          var isMax = $('#jk_layer-max').hasClass('jk_layer-max')
          if (isMax) {
            $('#jk_popup').removeAttr('style')
            $('#jk_popup').addClass('max')
            $('#jk_pop-iframe')
              .removeClass('notFullHeight')
              .addClass('fullHeight')
            $('#jk_layer-max')
              .removeClass('jk_layer-max')
              .addClass('jk_layer-min')
            that.menuShow = true
            $('#jk_layer-max').hide()
            $('.toMax').addClass('toSmall')
          } else {
            $('.toMax').removeClass('toSmall')
            $('#jk_popup').removeClass('max')
            $('#jk_layer-max')
              .removeClass('jk_layer-min')
              .addClass('jk_layer-max')
            $('#jk_pop-iframe').addClass('notFullHeight')
            that.menuShow = false
            that.resetStyle()
          }
          that.$store.dispatch('cardresize', isMax)
        })

      // startDrag(that.$refs["jklayertitle"], that.$refs["jkpopup"]);
    },
    success: function () {
      if (typeof this.opts.success === 'function') {
        this.opts.success()
      }
    },
    cancel: function () {
      if (typeof this.opts.cancel === 'function') {
        this.opts.cancel()
      }
    }
  }
}
</script>
<style lang='less' scoped>
/*重置popup样式*/
.border {
  border: 1px solid red;
}
.border-box {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.jk_ol-popup {
  display: none;
  position: absolute;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 0;
  margin: 0;
  /*border-radius: 10px;*/
  bottom: 0;
  left: 0;
  z-index: 1000;
  min-width: 280px;
  transition: all 500ms ease;
  &:after,
  &:before {
    top: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    margin-top: -11px;
    position: absolute;
    pointer-events: none;
  }
  &:after {
    border-right-color: white;
    border-width: 10px;
    left: -10px;
    margin-left: -10px;
  }
  &:before {
    border-right-color: #cccccc;
    border-width: 11px;
    left: -11px;
    margin-left: -11px;
  }
  .jk_ol-popup-closer {
    position: absolute;
    top: 0;
    right: 7px;
    text-align: center;
    display: block;
    text-decoration: none;
    width: 30px;
    box-sizing: content-box;
    height: 50px;
    line-height: 50px;
    z-index: 999;
    background: transparent;
    color: white;
    background: url(../../../static/lib/jk_layer/close.png) no-repeat;
    background-position: center center;
  }
  .jk_layer-title {
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #3d99fc;
    color: #ffffff;
    font-size: 18px;
    padding: 0 67px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    z-index: 2;
    cursor: move;
    .menu {
      position: absolute;
      top: 0;
      left: 7px;
      text-align: center;
      display: block;
      text-decoration: none;
      width: 30px;
      -webkit-box-sizing: content-box;
      box-sizing: content-box;
      height: 50px;
      line-height: 50px;
      z-index: 999;
      background: transparent;
      color: white;
      cursor: pointer;
    }
  }
}
#jk_popup-content {
  width: 100%;
  height: 100%;
  position: relative;
  .border-box;
}
/*jk_layer样式*/
.jk_layer-container {
  position: relative;
  margin: 0;
  padding: 0;
  min-width: 280px;
  width: 100%;
  background-color: #f2f2f2;
  height: calc(~"100% - 50px");
}
#jk_pop-iframe {
  width: 100%;
  height: calc(~"100% - 40px");
  box-sizing: border-box;
  overflow: hidden;
  overflow-y: auto;
  z-index: 0;
}
.notFullHeight {
  height: calc(100% - 30px);
}
.fullHeight {
  height: 100% !important;
}
#jk_layer-max {
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid whitesmoke;
  height: 40px;
  line-height: 39px;
  text-align: center;
  color: #51a0ef;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  z-index: 999;
  background: white;
}
#jk_layer-max:hover {
  color: #56abff;
}
.max {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  .jk_ol-popup-closer {
    right: 17px;
  }
  .toMax {
    right: 47px;
  }
  .jk_layer-title .menu {
    left: 17px;
  }
}

.toMax {
  position: absolute;
  top: 0;
  right: 37px;
  text-align: center;
  text-decoration: none;
  width: 30px;
  box-sizing: content-box;
  /*padding: 0 5px;*/
  height: 50px;
  line-height: 50px;
  z-index: 999;
  cursor: pointer;
  background: transparent;
  color: white;
  font-size: 30px;
  background: url(../../../static/lib/jk_layer/fullscreen.png) no-repeat;
  background-position: center center;
}
.toSmall {
  display: block;
  background: url(../../../static/lib/jk_layer/notfullscreen.png) no-repeat;
  background-position: center center;
}
</style>
