<template>
    <!-- Section-->
    <section class="py-5">
        <div class="container px-4 px-lg-5 mt-5">
            <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-2 row-cols-xl-2 mt-4">
                <div class="col mb-3 p-1">
                  <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg" @change="changeLine(selectedLine)" v-model="selectedLine">
                      <option selected disabled>請選擇線路</option>
                      <option v-for="data in line" :key="data.id" :value="data.LineID">{{ data.LineName.Zh_tw }}</option>
                  </select>
                </div>
                <div class="col mb-3 p-1">
                  <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg" @change="checkTime()" v-model="selectedStation">
                      <option selected disabled>請選擇車站</option>
                      <option v-for="data in station" :key="data.id" :value="data.StationID">{{ data.StationName.Zh_tw }}</option>
                  </select>
                </div>
            </div>

            <div class="row justify-content-center" v-show="isShow">
                <div class="progress mb-3 p-0">
                  <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :style="{width: progress+'%'}" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <table class="table table-bordered table-dark">
                    <thead>
                        <tr>
                            <th scope="col">前往方向</th>
                            <template v-for="data in destination">
                              <th :key="data.id">{{ data }}</th>
                            </template>
                        </tr>
                    </thead>
                    <tbody class="align-middle">
                        <tr>
                            <th scope="row">進站時間</th>
                            <template v-for="data in differenceText">
                              <td :key="data.id">{{ data }}</td>
                            </template>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>

<script>
let timer;
export default {
  data: function () {
    return {
      isShow: false,
      selectedLine: "請選擇線路",
      selectedStation: "請選擇車站",
      line:[],
      station:[],
      progress:100,
      destination:[],
      differenceTime:[],
      differenceText:[],
      distance:0,
      currentPosition:[],
      closedStation:""
    };
  },
  methods: {
    getLine() {
      const vm = this;
      const api = 'https://ptx.transportdata.tw/MOTC/v2/Rail/Metro/Line/TRTC?$format=JSON';
      vm.$http.get(api).then(response => {
        vm.line = response.data.filter(function(item) {
          return (item.LineID != "BR" && item.LineID != "Y");
        });
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
      vm.isShow = false;
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
    checkTime() {
      const vm = this;
      let api;
      vm.isShow = true;
      vm.progress = 100;
      vm.destination = [];
      vm.differenceTime = [];
      vm.differenceText = [];
      let date = new Date;
      let day = date.getDay();
      let time = date.getHours()*60 + date.getMinutes();
      
      if (day == 0 || day == 6) {
        api = `https://ptx.transportdata.tw/MOTC/v2/Rail/Metro/StationTimeTable/TRTC?$filter=StationID eq \'${vm.selectedStation}\' and ServiceDay/ServiceTag eq \'假日\'&$format=JSON`
      } else {
        api = `https://ptx.transportdata.tw/MOTC/v2/Rail/Metro/StationTimeTable/TRTC?$filter=StationID eq \'${vm.selectedStation}\' and ServiceDay/ServiceTag eq \'平日\'&$format=JSON`
      };

      vm.$http.get(api).then(response => {
        response.data.forEach(element => {
          let flag = true;
          vm.destination.push(element.DestinationStationName.Zh_tw)
          element.Timetables.forEach((element,index,array) => {
            let arrival = element.ArrivalTime.split(":");
            arrival = parseInt(arrival[0])*60 + parseInt(arrival[1]);
            if (arrival > time && flag) {
              flag = false;
              vm.differenceTime.push(arrival - time);
              vm.differenceText.push(time > 300 ? (arrival - time) + "分鐘後即將進站" : "末班已過");
            } else if (index === array.length - 1 && flag) {
              vm.differenceText.push("末班已過");
            };
          });
        });

        for (let i = 0; i < vm.destination.length; i++) {
          if (vm.destination[i] == vm.destination[i+1]) {
            vm.destination.splice(i + 1, 1);
            vm.differenceText.splice(vm.differenceTime[i] < vm.differenceTime[i+1] ? i + 1 : i, 1);
          };
        };

        vm.startProgress();
      }).catch(err => {
        if (err.response.status == "429") {
          alert("因為使用免費API，額度已使用完，請晚點再試，謝謝!");
        } else {
          alert(err);
        };
      });
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
    },
    startProgress() {
      const vm = this;
      timer = setInterval(countProgress, 100);

      function countProgress() {
        if (vm.progress <= 0) {
          vm.progress = 100;
          clearInterval(timer);
          vm.checkTime();
        } else {
          vm.progress = vm.progress - 0.2;
        };
      };
    }  
  },
  created() {
    this.getCurrentPosition();
  },
  mounted() {
    this.getLine();
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(timer);
    next();
  }
};
</script>

<style scoped>
</style>