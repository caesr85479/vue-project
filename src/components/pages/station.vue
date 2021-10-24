<template>
    <!-- Section-->
    <section class="py-5">
        <div class="container px-4 px-lg-5 mt-5">
            <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-2 row-cols-xl-2 mt-4 justify-content-center">
                <div class="col mb-3 p-1">
                  <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg" @change="changeLine(selectedLine)" v-model="selectedLine">
                      <option selected disabled>請選擇線路</option>
                      <option v-for="data in line" :key="data.id" :value="data.LineID">{{ data.LineName.Zh_tw }}</option>
                  </select>
                </div>
                <div class="col mb-3 p-1">
                  <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg" @change="checkStation()" v-model="selectedStation">
                      <option selected disabled>請選擇車站</option>
                      <option v-for="data in station" :key="data.id" :value="data.StationID">{{ data.StationName.Zh_tw }}</option>
                  </select>
                </div>
            </div>

            <div class="col mb-5">
              <div id="map" style="height:500px;"></div>
              <br/>
              <small v-html="locationDetail"></small>
            </div>
        </div>
    </section>
</template>

<script>
var map;
export default {
  data: function () {
    return {
      selectedLine: "請選擇線路",
      selectedStation: "請選擇車站",
      line:[],
      station:[],
      mapOptions:{
        center:[],
        zoom: 16
      },
      distance:0,
      stationPosition:[],
      currentPosition:[],
      closedStation:"",
      locationDetail:""
    };
  },
  methods: {
    getLine() {
      const vm = this;
      const api = 'https://ptx.transportdata.tw/MOTC/v2/Rail/Metro/Line/TRTC?$format=JSON';
      vm.$http.get(api).then(response => {
        vm.line = response.data;
      }).catch(err => {
        if (err.response.status == "429") {
          alert("因為使用免費API，額度已使用完，請晚點再試，謝謝!");
        } else {
          alert(err);
        };
      });
    },
    changeLine(lineId) {
      const vm = this;
      const api = 'https://ptx.transportdata.tw/MOTC/v2/Rail/Metro/StationOfLine/TRTC?$filter=LineID eq \''+ lineId +'\'&$format=JSON';
      vm.$http.get(api).then(response => {
        vm.selectedStation = "請選擇車站";
        vm.station = response.data[0].Stations;
      }).catch(err => {
        if (err.response.status == "429") {
          alert("因為使用免費API，額度已使用完，請晚點再試，謝謝!");
        } else {
          alert(err);
        };
      });
    },
    checkStation() {
      const vm = this;
      const api = `https://ptx.transportdata.tw/MOTC/v2/Rail/Metro/Station/TRTC?
      $filter=StationID eq \'${vm.selectedStation}\'&$format=JSON`;
      vm.$http.get(api).then(response => {
        vm.stationPosition = [
          response.data[0].StationPosition.PositionLat,
          response.data[0].StationPosition.PositionLon
        ]
        if (map) {
          map.off();
          map.remove();
        };
        vm.getMap(vm.stationPosition);
      }).catch(err => {
        if (err.response.status == "429") {
          alert("因為使用免費API，額度已使用完，請晚點再試，謝謝!");
        } else {
          alert(err);
        };
      });
    },
    getMap(position, zoom = 16) {
      const vm = this;
      map = new L.map('map',{center : position, zoom : zoom});
      var layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
      map.addLayer(layer);
      let marker = new L.Marker(position);
      marker.addTo(map);
      vm.locationDetail="<a href=\"https://www.openstreetmap.org/#map="+ zoom +"/"+ position[0] +"/"+ position[1] +"\">查看更大的地圖</a>";
    },
    getCurrentPosition() {
      const vm = this;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else { 
        alert("Geolocation is not supported by this browser.");
      };

      function showPosition(position) {
        vm.currentPosition = [position.coords.latitude, position.coords.longitude];
        vm.getClosedStation();
        vm.getMap(vm.currentPosition);
      };
    },
    getClosedStation() {
      const vm = this;
      const api = `https://ptx.transportdata.tw/MOTC/v2/Rail/Metro/Station/TRTC?$format=JSON`;
      vm.$http.get(api).then(response => {
        response.data.forEach(element => {
          calculateDistance(vm.currentPosition[0], vm.currentPosition[1], element.StationPosition.PositionLat, element.StationPosition.PositionLon, element.StationID);
        });
      }).catch(err => {
        if (err.response.status == "429") {
          alert("因為使用免費API，額度已使用完，請晚點再試，謝謝!");
        } else {
          alert(err);
        };
      });

      function calculateDistance(lat1, lon1, lat2, lon2, station) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
          vm.distance = 0;
        } else {
          var radlat1 = Math.PI * lat1/180;
          var radlat2 = Math.PI * lat2/180;
          var theta = lon1 - lon2;
          var radtheta = Math.PI * theta/180;
          var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
          if (dist > 1) { dist = 1; };
          dist = Math.acos(dist);
          dist = dist * 180/Math.PI;
          dist = dist * 60 * 1.1515;
          dist = dist * 1.609344;
          if(vm.distance == 0 || vm.distance > dist) {
            vm.distance = dist;
            vm.closedStation = station;
          };
        };
      };
    }
  },
  created() {
    this.getCurrentPosition();
  },
  mounted() {
    this.getLine();
  }
};
</script>

<style scoped>
</style>