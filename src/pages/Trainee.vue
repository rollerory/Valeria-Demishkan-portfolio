<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import Switcher from "@components/Switcher.vue";
import Title from "@/components/Title.vue";
import ModalImg from "@/components/ModalImg.vue";
import traineeData from "@/data/trainee/trainee.json";

import "swiper/css";
import "swiper/css/navigation";

type TraineeProject = {
  folder: string;
  images: string[];
};

const traineeProjects = computed(() => (traineeData as TraineeProject[]) ?? []);

const isModalOpen = ref<boolean>(false);
const modalImage = ref<string>("");
const isDesktop = ref<boolean>(false);

const updateIsDesktop = () => {
  if (typeof window === "undefined") return;
  isDesktop.value = window.matchMedia("(min-width: 768px)").matches;
};

const openModalImg = (imageSrc: string) => {
  if (!isDesktop.value) return;
  modalImage.value = imageSrc;
  isModalOpen.value = true;
};

const closeModalImg = () => {
  isModalOpen.value = false;
  modalImage.value = "";
};

onMounted(() => {
  updateIsDesktop();
  window.addEventListener("resize", updateIsDesktop);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateIsDesktop);
});
</script>

<template>
  <div class="trainee-page">
    <div class="container">
      <Title title="Trainee projects" />
      <Switcher />
      <div class="trainee-page__inner">
        <div
          v-for="project in traineeProjects"
          :key="project.folder"
          class="trainee-page__project"
          :class="{
            'trainee-page__project--multi': project.images?.length > 1,
          }"
        >
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
              v-for="image in project.images"
              :key="image"
              class="trainee-page__item"
            >
              <div class="trainee-page__item-img">
                <img
                  :src="`/src/data/trainee/${project.folder}/${image}`"
                  :alt="project.folder"
                  loading="lazy"
                  @click="openModalImg(`/src/data/trainee/${project.folder}/${image}`)"
                  @pointerup="openModalImg(`/src/data/trainee/${project.folder}/${image}`)"
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
    <ModalImg
      v-if="isModalOpen && isDesktop"
      :image="modalImage"
      @close="closeModalImg"
    />
  </div>
</template>

<style scoped lang="scss">
.trainee-page {
  padding: 100px 0;

  :deep(.switcher) {
    margin: 0 -16px 40px;
  }

  .swiper {
    overflow-y: visible;
    overflow-x: clip;
    @include media-lg {
      overflow-x: auto;
      overflow-y: visible;
      padding-right: 16px;
      scroll-padding-right: 16px;
    }
  }

  .swiper-wrapper {
    @include media-lg {
        transform: none !important;
        width: max-content;
        gap: 16px;
        padding-right: 16px;
    }
  }

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    top: -30px;
    bottom: auto;
    width: 40px;
    height: 40px;
    background: url("@assets/icons/arrow-right.svg") center/contain no-repeat;
    & svg {
      display: none;
    }
    @include media-lg {
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

  &__inner {
    display: grid;
    gap: 24px;
  }

  &__project {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    margin-bottom: 20px;

    :deep(.swiper) {
      width: 100%;
      max-width: 100%;
    }
  }

  &__project--multi {
    margin-top: 70px;
    @include media-lg {
        margin-top: 0;
    }
  }

  &__item {
    border-radius: 20px;
    overflow: hidden;
    &-img {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      img {
        display: block;
        width: 100%;
        height: 65vh;
        object-fit: cover;
        @include media-lg {
            height: 400px;
            width: auto;
        }
      }
    }
    @include media-lg {
      width: auto !important;
      flex: 0 0 auto;
      cursor: pointer;
      transition: all .3s ease;
      &:hover {
        transform: scale(0.99);
      }
    }
  }
}
</style>
