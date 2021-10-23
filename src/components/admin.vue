<template>
    <div>
        <navbar />
        <router-view />
        <foot />
    </div>
</template>

<script>
import navbar from "./shared/navbar.vue";
import footer from "./shared/footer.vue";
export default {
  name: "admin",
  data() {
    return {};
  },
  created() {
  },
  mounted(){
  },
  components: {
    navbar: navbar,
    foot: footer,
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
