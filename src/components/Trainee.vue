<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import Title from "./Title.vue";

import "swiper/css";
import "swiper/css/navigation";

const baseUrl = import.meta.env.BASE_URL;
const traineeProjects = ref<any[]>([]);

onMounted(async () => {
  const res = await fetch(`${baseUrl}data/trainee/trainee.json`);
  traineeProjects.value = await res.json();
});
</script>

<template>
  <section id="trainee" class="trainee">
    <div class="container">
      <Title title="Trainee projects" />

      <Swiper
        :modules="[Navigation]"
        :slides-per-view="1"
        :space-between="20"
        navigation
        :breakpoints="{
          768: { slidesPerView: 2, spaceBetween: 20 },
        }"
      >
        <SwiperSlide
          v-for="project in traineeProjects"
          :key="project.folder"
          class="project-slide"
        >
          <div class="project-slide__img">
            <img
              :src="`${baseUrl}data/trainee/${project.folder}/${project.images?.[0] ?? ''}`"
              :alt="project.folder"
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
        </SwiperSlide>
      </Swiper>
      <router-link to="/trainee" class="trainee__btn">
        <span>View projects in further detail</span>
        <img src="@/assets/icons/arrow-right.svg" alt="arrow rights">
      </router-link>
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
.trainee {
  :deep(.title) {
    padding-right: 110px;
  }
  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 20px 0 0 auto;
    font-size: 18px;
    background-color: transparent;
    border: none;
    color: $primary-color;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: underline;
    & img {
        width: 30px;
        height: 30px;
    }

    &:hover {
      cursor: pointer;
    }
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
    & img {
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
}
</style>
