<template>
    <div>
        <!-- Section-->
        <section class="py-5">
            <div class="container px-4 px-lg-5 mt-5">
                <div class="row gx-4 gx-lg-5 row-cols-1 row-cols-md-2 row-cols-xl-2">
                    <div class="col mb-5" v-for="data in news" :key="data.id">
                        <div class="card h-100">
                            <div class="card-header p-4 h-100">
                                <div class="text-center">
                                    <h5 class="fw-bolder">{{ data.Title }}</h5>
                                </div>
                            </div>
                            <div class="card-body p-4">
                                <div class="text-left" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; width:100%;">
                                  {{ data.Description }}
                                </div>
                            </div>
                            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                <div class="text-center">
                                  <a class="btn btn-outline-dark mt-auto" :href="data.NewsURL">查看詳細</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      news: []
    };
  },
  methods: {
    getNews() {
      const vm = this;
      const api = 'https://ptx.transportdata.tw/MOTC/v2/Rail/Metro/News/TRTC?$top=6&$format=JSON';
      vm.$http.get(api).then(response => {
        vm.news = response.data.Newses;
      }).catch(err => {
        if (err.response.status == "429") {
          alert("因為使用免費API，額度已使用完，請晚點再試，謝謝!");
        } else {
          alert(err);
        };
      });
    },
  },
  created() {
  },
  mounted() {
    this.getNews();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
