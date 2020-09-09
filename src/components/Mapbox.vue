<template>
  <div style="height:100%;width:100%;">
    <div ref="basicMapbox">
    </div>
    <!-- <div type="primary">test</div> -->

    <div class="setbox" v-show="drawer">
      <div class="draw-title">
        <p>{{airportName}}</p><i class="el-icon-circle-close" @click="drawer=!drawer"></i>
      </div>
      <!-- <el-button type="primary" @click="test">test</el-button> -->
      <!-- <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">机场天气</el-menu-item>
        <el-menu-item index="2">趋势分析</el-menu-item>
      </el-menu> -->
      <VAirportMeteo ref="airportMeteo"></VAirportMeteo>
    </div>
  </div>
</template>
<script>
  import mapboxgl from "mapbox-gl";
  // import MapboxLanguage from "@mapbox/mapbox-gl-language";
  import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js'
  import VAirportMeteo from './airportMeteo'
  // import vuescroll from 'vuescroll';
  // var MapboxGeocoder = require("@mapbox/mapbox-gl-geocoder");
  export default {
    data() {
      return {
        drawer: false,
        airportName: '',
        icao: '',
        stationCode: '',
        activeIndex: '1',
        layerStatus: true,
      };
    },
    components: {
      VAirportMeteo,
    },
    mounted() {
      this.init();
    },
    methods: {
      // handleSelect(key) {
      //   console.log(key);
      // },
      // 初始化
      test() {
        var tests = this.maptest.queryRenderedFeatures({
          layers: ["airportchina"] // replace this with the name of the layer
        });
        console.log(tests)
      },
      init() {
        let that = this;
        mapboxgl.accessToken =
          "pk.eyJ1IjoiYW50aG9ueXlhbmciLCJhIjoiY2tiOHkzazV1MDhybDJ6bWR3N3RibjVscSJ9.P9rOu7chJDRgEGUkMZ8ESw";
        // 英文标注转换为中文
        // mapboxgl.setRTLTextPlugin(
        //   "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js"
        // );
        var map = new mapboxgl.Map({
          container: this.$refs.basicMapbox,
          // style: "mapbox://styles/mapbox/streets-v10",
          style: "mapbox://styles/anthonyyang/ckbc7uceq0yz91innbwfvxc43",
          center: [114, 38.54],
          zoom: 6
        })
        // this.maptest = map;

        // map.addControl(
        //   new MapboxGeocoder({
        //     accessToken: mapboxgl.accessToken,
        //     mapboxgl: mapboxgl,
        //     countries: 'cn',

        //   }), "top-left"
        // );
        var coordinatesGeocoder = function (query) {
          // match anything which looks like a decimal degrees coordinate pair
          var matches = query.match(
            /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
          );
          if (!matches) {
            return null;
          }

          function coordinateFeature(lng, lat) {
            return {
              center: [lng, lat],
              geometry: {
                type: 'Point',
                coordinates: [lng, lat]
              },
              place_name: 'Lat: ' + lat + ' Lng: ' + lng,
              place_type: ['coordinate'],
              properties: {},
              type: 'Feature'
            };
          }

          var coord1 = Number(matches[1]);
          var coord2 = Number(matches[2]);
          var geocodes = [];

          if (coord1 < -90 || coord1 > 90) {
            // must be lng, lat
            geocodes.push(coordinateFeature(coord1, coord2));
          }

          if (coord2 < -90 || coord2 > 90) {
            // must be lat, lng
            geocodes.push(coordinateFeature(coord2, coord1));
          }

          if (geocodes.length === 0) {
            // else could be either lng, lat or lat, lng
            geocodes.push(coordinateFeature(coord1, coord2));
            geocodes.push(coordinateFeature(coord2, coord1));
          }

          return geocodes;
        };

        map.addControl(
          new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            localGeocoder: coordinatesGeocoder,
            zoom: 4,
            // placeholder: '输入机场名称',
            mapboxgl: mapboxgl
          }), "top-left"
        );

        //地图导航
        var nav = new mapboxgl.NavigationControl();
        map.addControl(nav, "bottom-left");
        let adjust = 2.3;

        map.on('load', function () {
          map.addSource("myImageSource", {
            "type": "image",
            "url": require("../assets/radar.png"),
            "coordinates": [
              [73 + adjust, 54.2],
              [135 + adjust, 54.2],
              [135 + adjust, 12.2],
              [73 + adjust, 12.2],
            ]
          });
          map.addLayer({
            "id": "overlay",
            "source": "myImageSource",
            "type": "raster",
            "paint": {
              "raster-opacity": 0.85
            }
          });
        });

        function addLayer() {
          map.addLayer({
            "id": "overlay",
            "source": "myImageSource",
            "type": "raster",
            "paint": {
              "raster-opacity": 0.85
            }
          });
        }


        map.on("click", (e) => {
          var features = map.queryRenderedFeatures(e.point, {
            layers: ["airportchina"] // replace this with the name of the layer
          });
          // console.log(e.point)
          // console.log(features)
          if (!features.length) {
            return;
          }

          var feature = features[0];

          this.drawer = true;
          this.airportName = feature.properties.title;
          let location = feature.geometry.coordinates[1] + ',' + feature.geometry.coordinates[0]
          // console.log(location)
          this.$store.commit("updateLocation", location)
          this.$refs.airportMeteo.init();
          this.$refs.airportMeteo.drawChart();
          // this.$refs.airportMeteo.drawChart();
          new mapboxgl.Popup({
              offset: [0, -15]
            })
            .setLngLat(feature.geometry.coordinates)
            .setHTML(
              "<h3>" +
              feature.properties.title +
              "</h3><p>" +
              feature.properties.icao +
              "</p>"
            )
            .addTo(map);
        });

        // // 比例尺
        var scale = new mapboxgl.ScaleControl({
          maxWidth: 80,
          unit: "imperial"
        });
        map.addControl(scale);
        scale.setUnit("metric");

        class ToggleControl {
          onAdd(map) {
            this.map = map;
            this.container = document.createElement('div');
            this.container.className = 'my-custom-control';

            const button1 = this._createButton('monitor_button', "雷达图")
            const button2 = this._createButton('monitor_button', "气象云图")
            this.container.appendChild(button1);
            this.container.appendChild(button2);
            return this.container;
          }
          onRemove() {
            this.container.parentNode.removeChild(this.container);
            this.map = undefined;
          }
          _createButton(className, textContent) {
            const el = window.document.createElement('el-button')
            if (textContent == "雷达图") {
              el.className = "el-icon-rank " + className;
            } else {
              el.className = "el-icon-wind-power " + className;
            }
            el.textContent = " " + textContent;

            if (textContent == "雷达图") {
              el.addEventListener('click', (e) => {
                // e.style.display = 'none'
                // console.log(e);
                // console.log(that)
                if (that.layerStatus == true) {
                  map.removeLayer("overlay");
                  that.layerStatus = false;
                } else {
                  addLayer();
                  that.layerStatus = true;
                }
                // e.preventDefault()
                e.stopPropagation()
              }, false)
            } else {
              el.addEventListener('click', () => {
                // e.style.display = 'none'
                // console.log(e);
                // console.log(that)
                map.removeLayer("airportchina")
                // that.$router.push('/satellite')
              }, false)
            }
            return el;
          }
        }
        const toggleControl = new ToggleControl()
        map.addControl(toggleControl, 'top-left')

      }
    }
  };
</script>
<style lang="less">
  .setbox {
    position: fixed;
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 1000;
    top: 0px;
    // bottom: 0px;
    // right: -350px;
    right: 0;
    width: 430px;
    height: 100%;
    background: #ffffff;
    border-radius: 5px;
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;
  }

  .mapboxgl-map {
    height: 100%;
    width: 100%;
  }

  .draw-title {
    display: flex;
    height: 64px;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    font-size: 18px;
    background: rgba(145, 180, 150, 0.7);
    color: #fff;
  }

  /* .mapboxgl-popup {
    max-width: 200px;
  } */

  .mapboxgl-popup-content {
    text-align: center;
    font-family: "Open Sans", sans-serif;
  }

  .geocoder {
    position: absolute;
    z-index: 1;
    width: 50%;
    left: 50%;
    margin-left: -25%;
    top: 20px;
  }


  .marker {
    background-image: url('../assets/logo.png');
    background-size: cover;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
  }

  .my-custom-control {
    pointer-events: auto !important;
    border: 0;
  }

  .monitor_button {
    color: rgba(0, 0, 0, 0.75);
    background: #fff;
    border-radius: 5px;
    border: 0;
    margin: 10px;
    height: 30px;
    line-height: 30px;
    outline: none;
    cursor: pointer;

    &:hover {
      background: rgba(103, 128, 159, 0.6);
      border: 0;
    }

    &:active {
      background: rgba(103, 128, 159, 1);
      border: 0;
    }
  }

  /* .mapboxgl-ctrl-geocoder {
    min-width: 100%;
  } */
</style>