<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container px-4 px-lg-5">
            <a class="navbar-brand" href="#" @click.prevent = "home"><i class="fas fa-subway"></i></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                    <!-- <li class="nav-item"><a class="nav-link active" aria-current="page" href="#!">Home</a></li> -->
                    <li class="nav-item"><a class="nav-link" href="#" :class="{'active':isActive.isNews}" @click.prevent="news">最新消息</a></li>
                    <li class="nav-item"><a class="nav-link" href="#" :class="{'active':isActive.isStation}" @click.prevent="station">車站位置</a></li>
                    <li class="nav-item"><a class="nav-link" href="#" :class="{'active':isActive.isTime}" @click.prevent="time">進站時刻</a></li>
                    <li class="nav-item"><a class="nav-link" href="#" :class="{'active':isActive.isFare}" @click.prevent="fare">票價查詢</a></li>
                    <li class="nav-item"><a class="nav-link" href="#" :class="{'active':isActive.isMap}" @click.prevent="map">捷運地圖</a></li>
                </ul>
                <!-- <form class="d-flex">
                    <button class="btn btn-outline-dark" type="submit" @click.prevent="">
                        <i class="fas fa-shopping-cart"></i>
                        Cart
                        <span class="badge bg-dark text-white ms-1 rounded-pill">0</span>
                    </button>
                </form> -->
            </div>
        </div>
    </nav>
    <!-- Header-->
    <header class="bg-dark py-5">
        <div class="container px-4 px-lg-5 my-5">
            <div class="text-center text-white">
                <h1 class="display-4 fw-bolder">{{ title }}</h1>
                <p class="lead fw-normal text-white-50 mb-0">{{ note }}</p>
            </div>
        </div>
    </header>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title:"台北捷運練習作品",
      note:"Vue Project",
      isActive: {
        isNews: false,
        isStation : false,
        isTime : false,
        isFare: false,
        isMap: false
      }
    };
  },
  methods: {
    home() {
      this.title = "台北捷運練習作品";
      this.note = "Vue Project",
      this.isActive.isNews = false;
      this.isActive.isStation = false;
      this.isActive.isTime = false;
      this.isActive.isFare = false;
      this.isActive.isMap = false;
      this.$router.push("/");
    },
    news() {
      this.title = "最新消息";
      this.note = "串接捷運新聞API",
      this.isActive.isNews = true;
      this.isActive.isStation = false;
      this.isActive.isTime = false;
      this.isActive.isFare = false;
      this.isActive.isMap = false;
      this.$router.push("/news");
    },
    station() {
      this.title = "台北捷運車站位置";
      this.note = "使用openstreetmap做地圖展示，使用leaflet.js操作",
      this.isActive.isNews = false;
      this.isActive.isStation = true;
      this.isActive.isTime = false;
      this.isActive.isFare = false;
      this.isActive.isMap = false;
      this.$router.push("/station");
    },
    time() {
      this.title = "台北捷運進站時刻";
      this.note = "藉由使用者的選擇當條件，串接API",
      this.isActive.isNews = false;
      this.isActive.isStation = false;
      this.isActive.isTime = true;
      this.isActive.isFare = false;
      this.isActive.isMap = false;
      this.$router.push("/time");
    },
    fare() {
      this.title = "台北捷運票價查詢";
      this.note = "藉由使用者的選擇當條件，串接API",
      this.isActive.isNews = false;
      this.isActive.isStation = false;
      this.isActive.isTime = false;
      this.isActive.isFare = true;
      this.isActive.isMap = false;
      this.$router.push("/fare");
    },
    map() {
      this.title = "台北捷運地圖";
      this.note = "可點擊下面這張捷運圖的各站查看詳細資訊，資料來源:台北捷運公司",
      this.isActive.isNews = false;
      this.isActive.isStation = false;
      this.isActive.isTime = false;
      this.isActive.isFare = false;
      this.isActive.isMap = true;
      this.$router.push("/map");
    }
  },
  created() {
    if (this.$route.name == 'news') {
      this.title = "最新消息";
      this.note = "串接捷運新聞API",
      this.isActive.isNews = true;
    } else if (this.$route.name == 'station') {
      this.title = "台北捷運車站位置";
      this.note = "使用openstreetmap做地圖展示，使用leaflet.js操作",
      this.isActive.isStation = true;
    } else if (this.$route.name == 'time') {
      this.title = "台北捷運進站時刻";
      this.note = "藉由使用者的選擇當條件，串接API",
      this.isActive.isTime = true;
    } else if (this.$route.name == 'fare') {
      this.title = "台北捷運票價查詢";
      this.note = "藉由使用者的選擇當條件，串接API",
      this.isActive.isFare = true;
    } else if (this.$route.name == 'map') {
      this.title = "台北捷運地圖";
      this.note = "可點擊下面捷運圖的各站查看詳細資訊，資料來源:台北捷運公司",
      this.isActive.isMap = true;
    };
  },
  mounted() {
  }
};
</script>