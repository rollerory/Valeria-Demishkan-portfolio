<script setup lang="ts">
import gsap from 'gsap';
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
    title: String
})

const titleEl = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
    const el = titleEl.value;
    if (!el) return;

    gsap.set(el, { opacity: 0, x: -50 });

    observer = new IntersectionObserver(
        ([entry]) => {
            if (!entry || !entry.isIntersecting) return;
            gsap.to(el, {
                opacity: 1,
                x: 0,
                duration: 1
            });
            observer?.disconnect();
            observer = null;
        },
        {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0
        }
    );

    observer.observe(el);
});

onUnmounted(() => {
    observer?.disconnect();
    observer = null;
});
</script>

<template>
    <h2 ref="titleEl" class="title">{{ props.title }}</h2>
</template>

<style scoped lang="scss">
.title {
    font-family: 'Italiana', sans-serif;
    color: $accent-color;
    font-size: 52px;
    font-weight: 700;
    margin-bottom: 30px;
    line-height: 110%;

    @include media-md {
        font-size: 72px;
    }
}
</style>
