<template>
  <div @click="swtichLayerManager" class="zoomin2" :class="show?'selected':''" title="图层">
    <i class="iconfont icon-coverage"></i>
    <transition name="el-fade-in">
      <div class="layer-manager" v-show="show" >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>图层管理</span>
            <el-button style="float: right; padding: 3px 0" type="text">关闭</el-button>
          </div>
          <el-tree
            :data="layers"
            show-checkbox
            node-key="id"
            ref="tree"
            :default-checked-keys="['fzhistory_building','fz_district']"
            :check-on-click-node="true"
            @check="change"
            :props="defaultProps">
          </el-tree>
        </el-card>
      </div>
    </transition>

  </div>
</template>

<script>
  // import Globel from '@/components/globel.vue'
  export default {
    name: 'LayerManager',
    data () {
      return {
        show:false,
        layers: [{
          id: 'fzhistory_building',
          label: '历史建筑',
          /*children: [
            {
            id: 'fzhistory_single',
            label: '单体',
            },
            {
              id: 'fzhistory_yard',
              label: '合院',
            }
          ]*/
        }, {
          id: 'fz_district',
          label: '历史地段',
        },
          {
          id: 'environment_feature',
          label: '环境要素',
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      swtichLayerManager(){
        this.show=!this.show;
      },
      change(e,v,a){
        let layers=[];
        for(let node in this.$refs.tree.store.nodesMap){
          if(this.$refs.tree.store.nodesMap[node]['childNodes'].length===0){
            layers.push({id:node,show:this.$refs.tree.store.nodesMap[node].checked})
          }
        }
        this.$store.commit("setShowLayer",layers);
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
    color:#409eff;
  }
  .active img {
    border: 1px solid #ddd;
  }
  .layer-manager{
    position: absolute;
    z-index: 999;
    /*margin-left: 50px;*/
    margin-left: -250px;
    .box-card {
      width: 200px;
    }
  }
/*  .right-margin{
    margin-left: -730px;
    transition: margin-left 1s;
  }*/
</style>
