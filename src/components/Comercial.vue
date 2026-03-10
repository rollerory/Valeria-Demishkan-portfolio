<script setup lang="ts">
import { computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import Title from "./Title.vue";

import "swiper/css";
import "swiper/css/navigation";

const projectModules = import.meta.glob("@/data/projects/**/project.json", {
  eager: true,
});

const projects = Object.values(projectModules).map((m: any) => m.default);

const commercialProjects = computed(() =>
  projects
    .filter((p) => p.type === "comercial")
    .sort((a, b) => {
      const yearDiff = Number(b.year) - Number(a.year);
      if (yearDiff !== 0) return yearDiff;
      return String(a.title).localeCompare(String(b.title));
    }),
);
</script>

<template>
  <section id="comercial" class="comercial">
    <div class="container">
      <Title title="Comercial projects" />

      <Swiper
        :modules="[Navigation]"
        :slides-per-view="1"
        :space-between="20"
        navigation
        :breakpoints="{
          768: { slidesPerView: 2, spaceBetween: 20 },
        }"
      >
        <SwiperSlide v-for="project in commercialProjects" :key="project.slug">
          <router-link :to="`/projects/${project.slug}`" class="project-slide">
            <div class="project-slide__img">
              <img
                :src="`/data/projects/${project.slug}/${project.cover}`"
                :alt="project.title"
                loading="lazy"
              />
              <svg class="button" expanded="true" height="100px" width="100px">
                <circle
                  class="innerCircle"
                  cx="50%"
                  cy="50%"
                  r="25%"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="5%"
                >
                  <animate
                    attributeType="SVG"
                    attributeName="r"
                    begin="0s"
                    dur="1.5s"
                    repeatCount="indefinite"
                    from="5%"
                    to="25%"
                  />
                  <animate
                    attributeType="CSS"
                    attributeName="stroke-width"
                    begin="0s"
                    dur="1.5s"
                    repeatCount="indefinite"
                    from="3%"
                    to="0%"
                  />
                  <animate
                    attributeType="CSS"
                    attributeName="opacity"
                    begin="0s"
                    dur="1.5s"
                    repeatCount="indefinite"
                    from="1"
                    to="0"
                  />
                </circle>
              </svg>
            </div>

            <div class="project-slide__info">
              <h3>{{ project.title }}</h3>
              <p>{{ project.location }}</p>
            </div>
          </router-link>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<style scoped lang="scss">
.swiper {
  margin: 0 -16px;
  padding: 0 16px;
  overflow-y: visible;
  overflow-x: clip;
}
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  top: -30px;
  width: 40px;
  height: 40px;
  background: url("@assets/icons/arrow-right.svg") center/contain no-repeat;
  & svg {
    display: none;
  }
}
:deep(.swiper-button-prev) {
  left: auto !important;
  right: 80px !important;
  transform: rotate(180deg);
}
:deep(.swiper-button-next) {
  right: 16px !important;
}
:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
  content: "";
}
.comercial {
  :deep(.title) {
    padding-right: 110px;
  }
}
.project-slide {
  display: block;
  text-decoration: none;
  color: inherit;
  height: 65vh;
  position: relative;

  &__img {
    height: 100%;
    overflow: hidden;
    border-radius: 20px;
    position: relative;
    & svg {
      position: absolute;
      right: -10px;
      bottom: -10px;
    }
    & img {
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  &__info {
    padding-top: 10px;
    border-radius: 15px;
  }

  h3 {
    font-size: 20px;
  }

  p {
    opacity: 0.6;
  }
}

@keyframes blobFloat {
  0% {
    transform: translate(0, 0);
  }
  20% {
    transform: translate(20px, -15px);
  }
  40% {
    transform: translate(-25px, 10px);
  }
  60% {
    transform: translate(15px, 25px);
  }
  80% {
    transform: translate(-10px, -20px);
  }
  100% {
    transform: translate(0, 0);
  }
}

@keyframes blobRotate {
  0% {
    rotate: 0deg;
    scale: 1;
  }
  50% {
    scale: 1.15;
  }
  100% {
    rotate: 360deg;
    scale: 1;
  }
}
</style>
