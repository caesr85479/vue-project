<template>
    <div>
        <!-- Section-->
        <section class="py-5">
            <div>
                <h1 class="mb-5">{{ msg }}</h1>
                <h2>資料介接「交通部PTX平臺」& 平臺標章</h2>
                <a href="https://ptx.transportdata.tw/PTX/">
                  <img src="../../assets/img/PTX_logo_light.png" class="w-50" />
                </a>
            </div>
        </section>
    </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      msg: "Vue.js的練習作品",
    };
  },
  methods: {
  },
  created() {
  },
  mounted() {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
