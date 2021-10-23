<template>
  <!-- Section-->
  <section class="py-5">
    <div class="container px-4 px-lg-5 mt-5">
      <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-2 row-cols-xl-2 mt-4">
        <div class="col mb-3 p-1">
          <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg" @change="changeLine(selectedLine1,true)" v-model="selectedLine1">
            <option selected disabled>請選擇線路</option>
            <option v-for="data in line" :key="data.id" :value="data.LineID">{{ data.LineName.Zh_tw }}</option>
          </select>
          <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg" @change="changeLine(selectedLine2,false)" v-model="selectedLine2">
            <option selected disabled>請選擇線路</option>
            <option v-for="data in line" :key="data.id" :value="data.LineID">{{data.LineName.Zh_tw}}</option>
          </select>
        </div>
        <div class="col mb-3 p-1">
          <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg" @change="checkFare()" v-model="selectedStation1">
            <option selected disabled>請選擇起站</option>
            <option v-for="data in station1" :key="data.id" :value="{ id: data.StationID, text: data.StationName.Zh_tw }">{{ data.StationName.Zh_tw }}</option>
          </select>
          <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg" @change="checkFare()" v-model="selectedStation2">
            <option selected disabled>請選擇迄站</option>
            <option v-for="data in station2" :key="data.id" :value="{ id: data.StationID, text: data.StationName.Zh_tw }">{{ data.StationName.Zh_tw }}</option>
          </select>
        </div>
      </div>

      <div class="row justify-content-center" v-show="isShow">
        <table class="table table-bordered table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col" colspan="2">起站</th>
              <th scope="col" colspan="2">迄站</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">站名</th>
              <td colspan="2">{{ selectedStation1.text }}</td>
              <td colspan="2">{{ selectedStation2.text }}</td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">成人票</th>
              <th scope="col">敬老票</th>
              <th scope="col">愛心票</th>
              <th scope="col">愛心優待/陪伴票</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">票價</th>
              <td v-for="data in fare" :key="data.id">{{ data.Price }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data: function () {
    return {
      isShow: false,
      selectedLine1: "請選擇線路",
      selectedLine2: "請選擇線路",
      selectedStation1: "請選擇起站",
      selectedStation2: "請選擇迄站",
      line:[],
      station1:[],
      station2:[],
      fare:[]
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
    changeLine(lineId,boolean) {
      const vm = this;
      vm.isShow = false;
      const api = 'https://ptx.transportdata.tw/MOTC/v2/Rail/Metro/StationOfLine/TRTC?$filter=LineID eq \''+ lineId +'\'&$format=JSON';
      vm.$http.get(api).then(response => {
        if (boolean) {
          vm.selectedStation1 = "請選擇起站";
          vm.station1 = response.data[0].Stations;
        } else if (!boolean) {
          vm.selectedStation2 = "請選擇迄站";
          vm.station2 = response.data[0].Stations;
        };
      }).catch(err => {
        if (err.response.status == "429") {
          alert("因為使用免費API，額度已使用完，請晚點再試，謝謝!");
        } else {
          alert(err);
        };
      });
    },
    checkFare() {
      const vm = this;
      if (vm.selectedStation1.id && vm.selectedStation2.id) {
        vm.isShow = true;
        const api = `https://ptx.transportdata.tw/MOTC/v2/Rail/Metro/ODFare/TRTC?$filter=
          OriginStationID eq \'${vm.selectedStation1.id}\' and 
          DestinationStationID eq \'${vm.selectedStation2.id}\'&$format=JSON`;
        vm.$http.get(api).then(response => {
          const set = new Set();
          vm.fare = response.data[0].Fares;
          vm.fare = vm.fare.filter(item => !set.has(item.FareClass) ? set.add(item.FareClass) : false);
        }).catch(err => {
          if (err.response.status == "429") {
            alert("因為使用免費API，額度已使用完，請晚點再試，謝謝!");
          } else {
            alert(err);
          };
      });
      };
    }
  },
  created() {
  },
  mounted() {
    this.getLine();
  },
};
</script>

<style scoped>
</style>