<template>
    <div>
        <!-- Section-->
        <section class="py-5">
            <div>
                <h1 class="mb-3">{{ name }}</h1>
                <h5 class="mb-5">{{ msg }}</h5>
                <h3>交通部PTX平臺標章</h3>
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
      name: "梁育",
      msg: "使用Vue-cli環境，資料串接「交通部PTX平臺」，自學Vue.js的練習作品",
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
h1,h2,h3,h4,h5 {
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
