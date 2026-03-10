<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick, provide } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@components/Header.vue';
import Loader from '@components/Loader.vue';
import { useRouter } from 'vue-router';
import Footer from './components/Footer.vue';

const isRow = ref(false)
const isBorderChange = ref(false)
const isLoading = ref(true)
const isRouteLoading = ref(false)
const showLoader = ref(true)
const loaderCycleDone = ref(false)
const router = useRouter()
let stopBefore: (() => void) | null = null
let stopAfter: (() => void) | null = null
let routeLoadToken = 0
const wantsLoader = computed(() => isLoading.value || isRouteLoading.value)
const loaderHidden = computed(() => !showLoader.value)

provide('loaderHidden', loaderHidden)

const waitForImages = async (root: ParentNode) => {
    const images = Array.from(root.querySelectorAll<HTMLImageElement>('img'))
    const pending = images.filter((img) => {
        const isLazy =
            img.loading === 'lazy' || img.getAttribute('loading') === 'lazy'
        return !isLazy && !img.complete
    })
    if (pending.length === 0) return
    await Promise.all(
        pending.map(
            (img) =>
                new Promise<void>((resolve) => {
                    const onDone = () => {
                        img.removeEventListener('load', onDone)
                        img.removeEventListener('error', onDone)
                        resolve()
                    }
                    img.addEventListener('load', onDone)
                    img.addEventListener('error', onDone)
                }),
        ),
    )
}

const handleLoaderCycle = () => {
    loaderCycleDone.value = true
    if (!wantsLoader.value) {
        showLoader.value = false
    }
}

watch(wantsLoader, (next) => {
    if (next) {
        if (!showLoader.value) showLoader.value = true
        loaderCycleDone.value = false
        return
    }
    if (loaderCycleDone.value) {
        showLoader.value = false
    }
}, { immediate: true })

onMounted(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
        start: window.innerHeight - 240,
        onEnter: () => isRow.value = true,
        onLeaveBack: () => isRow.value = false
    });
    
    ScrollTrigger.create({
        start: window.innerHeight + 50,
        onEnter: () => isBorderChange.value = true,
        onLeaveBack: () => isBorderChange.value = false
    });

    const initLoad = async () => {
        await nextTick()
        await waitForImages(document)
        isLoading.value = false
    }
    initLoad()

    stopBefore = router.beforeEach(() => {
        isRouteLoading.value = true
        return true
    })

    stopAfter = router.afterEach(async () => {
        const token = ++routeLoadToken
        await nextTick()
        await waitForImages(document)
        if (token === routeLoadToken) {
            isRouteLoading.value = false
        }
    })
})

onBeforeUnmount(() => {
    if (stopBefore) stopBefore()
    if (stopAfter) stopAfter()
})
</script>

<template>
    <div id="app">
        <transition name="loader-fade">
            <Loader v-if="showLoader" @cycle="handleLoaderCycle" />
        </transition>
        <Header :isRow="isRow" :isBorderChange="isBorderChange" />
        <router-view />
        <Footer />
    </div>
</template>

<style scoped>
#app {
    /* position: relative; */
}

.loader-fade-enter-active,
.loader-fade-leave-active {
    transition: opacity 0.3s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
    opacity: 0;
}
</style>
