<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Title from "@/components/Title.vue";
import ModalImg from "@/components/ModalImg.vue";
import Switcher from "@/components/Switcher.vue";

const route = useRoute();
const router = useRouter();
const slug = computed(() => String(route.params.slug));

const baseUrl = import.meta.env.BASE_URL;
const project = ref<any>(null);
const dayNight = computed(() => project.value?.["day-night"]);
const dayNightDaySrc = computed(() =>
  dayNight.value
    ? `${baseUrl}data/projects/${project.value?.slug}/day-night/${dayNight.value.day}`
    : ""
);
const dayNightNightSrc = computed(() =>
  dayNight.value
    ? `${baseUrl}data/projects/${project.value?.slug}/day-night/${dayNight.value.night}`
    : ""
);

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

onMounted(async () => {
  const res = await fetch(`${baseUrl}data/projects/${slug.value}/project.json`);
  if (!res.ok) {
    router.replace({ name: "Home" });
    return;
  }
  project.value = await res.json();
  updateIsDesktop();
  window.addEventListener("resize", updateIsDesktop);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateIsDesktop);
});
</script>

<template>
  <section class="project" v-if="project">
    <!-- <HomeHead :title="project.title" /> -->
    <div class="project__container container">
      <Title :title="project.title" />

      <p class="project__location">{{ project.location }}</p>
      <p class="project__year">{{ project.year }}</p>
      <p class="project__description">{{ project.description }}</p>
      <Switcher
        v-if="dayNight"
        :day-src="dayNightDaySrc"
        :night-src="dayNightNightSrc"
      />

      <section
        class="project__space space"
        v-for="space in project.spaces"
        :key="space.folder"
        >
        <div class="project__space-after"></div>
        <h2 class="space__name">{{ space.name }}</h2>

        <div class="space__images">
          <img
            v-for="img in space.images"
            :key="img"
            class="space__image"
            :src="`${baseUrl}data/projects/${project.slug}/${space.folder}/${img}`"
            :alt="space.name"
            loading="lazy"
            @click="openModalImg(`${baseUrl}data/projects/${project.slug}/${space.folder}/${img}`)"
            @pointerup="openModalImg(`${baseUrl}data/projects/${project.slug}/${space.folder}/${img}`)"
          />
        </div>
      </section>

      <button class="project__back-button" @click="$router.back()">
        <img
          class="project__back-icon"
          src="@/assets/icons/arrow-right.svg"
          alt="arrow left"
          loading="lazy"
        />
        <span class="project__back-text">Back to all projects</span>
      </button>
    </div>
    <ModalImg
      v-if="isModalOpen && isDesktop"
      :image="modalImage"
      @close="closeModalImg"
    />
  </section>
</template>

<style scoped lang="scss">
.project {
  padding: 100px 0 40px;
}

.project__location {
  opacity: 0.7;
  margin-bottom: 8px;
}

.project__year {
  opacity: 0.7;
  margin-bottom: 24px;
}

.project__description {
  margin-bottom: 2rem;
  line-height: 1.6;
}

.switcher {
    margin-left: -16px;
    margin-right: -16px;
}

.project__space {
  margin-bottom: 3rem;
  position: relative;
  &-after {
        display: none;
        position: absolute;
        right: 0;
        top: auto;
        bottom: 0;
        height: 500px;
        width: 200px;
        background: linear-gradient(90deg,rgba(255, 255, 255, 0) 10%, rgba(255, 255, 255, 1) 80%);
    }
}

.space__name {
  font-size: 2rem;
  margin-bottom: 1rem;
  @include media-md {
    display: inline-block;
    position: relative;
    &::after {
        content: '*Click on the image to view it in full size';
        position: absolute;
        right: -20px;
        bottom: 0;
        top: auto;
        width: max-content;
        line-height: 20px;
        font-size: 14px;
        font-weight: 300;
        opacity: 0.7;
        transform: translateX(100%);
    }
  }
}

.space__images {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 50px;
  @include media-md {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }
}

.space__image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  @include media-md {
    height: 500px;
    width: auto;
    flex: 1 1 auto;
    min-width: 280px;
    max-width: 100%;
    object-fit: cover;
    object-position: center;
    cursor: pointer;
    transition: all .3s ease;
    &:hover {
        transform: scale(0.99);
    }
  }
}

.project__back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 50px 0 0 auto;
  font-size: 18px;
  background-color: transparent;
  border: none;
  color: $primary-color;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: underline;

  &:hover {
    cursor: pointer;
  }
}

.project__back-icon {
  max-width: 20px;
  width: 100%;
  transform: rotate(180deg);
}
</style>
