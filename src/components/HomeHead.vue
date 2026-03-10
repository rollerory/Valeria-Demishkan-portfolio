<script setup lang="ts">
import { computed, inject, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import gsap from 'gsap';

const props = defineProps({
    title: String,
    text: String
})

const titleRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const loaderHidden = inject('loaderHidden', computed(() => true))
const hasTitleAnimated = ref(false)
const hasTextAnimated = ref(false)
const titleLines = ref<HTMLElement[]>([])
let titleTimeout: number | null = null
let textTimeout: number | null = null

const buildTitleLines = () => {
    const el = titleRef.value
    if (!el) return

    const text = (el.textContent || '').trim()
    if (!text) return

    el.innerHTML = ''
    const words = text.split(/\s+/)
    const wordSpans = words.map((word, index) => {
        const span = document.createElement('span')
        span.className = 'head__title-word'
        span.textContent = index < words.length - 1 ? `${word} ` : word
        el.appendChild(span)
        return span
    })

    const lines: HTMLSpanElement[][] = []
    let currentTop = wordSpans[0]?.offsetTop ?? 0
    let currentLine: HTMLSpanElement[] = []

    wordSpans.forEach((word) => {
        const top = word.offsetTop
        if (Math.abs(top - currentTop) > 1 && currentLine.length) {
            lines.push(currentLine)
            currentLine = []
            currentTop = top
        }
        currentLine.push(word)
    })
    if (currentLine.length) lines.push(currentLine)

    el.innerHTML = ''
    const lineEls: HTMLSpanElement[] = []
    lines.forEach((lineWords) => {
        const lineEl = document.createElement('span')
        lineEl.className = 'head__title-line'
        lineWords.forEach((word) => lineEl.appendChild(word))
        el.appendChild(lineEl)
        lineEls.push(lineEl)
    })

    titleLines.value = lineEls
    if (lineEls.length) {
        gsap.set(lineEls, { opacity: 0 })
    }
}

const runTitleIntro = () => {
    if (hasTitleAnimated.value || !titleRef.value) return
    hasTitleAnimated.value = true
    if (!titleLines.value.length) buildTitleLines()
    const targets = titleLines.value.length ? titleLines.value : [titleRef.value]
    gsap.to(targets, {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.15
    })
}

const runTextIntro = () => {
    if (hasTextAnimated.value || !textRef.value) return
    hasTextAnimated.value = true
    gsap.to(textRef.value, {
        opacity: 1,
        x: 0,
        duration: 1
    })
}

watch(
    loaderHidden,
    (hidden) => {
        if (!hidden) return
        if (titleTimeout) window.clearTimeout(titleTimeout)
        if (textTimeout) window.clearTimeout(textTimeout)
        titleTimeout = window.setTimeout(() => {
            runTitleIntro()
        }, 500)
        textTimeout = window.setTimeout(() => {
            runTextIntro()
        }, 1000)
    },
    { immediate: true, flush: 'post' }
)

onMounted(() => {
    buildTitleLines()
    if (textRef.value) {
        gsap.set(textRef.value, { opacity: 0 })
    }
})

onBeforeUnmount(() => {
    if (titleTimeout) window.clearTimeout(titleTimeout)
    if (textTimeout) window.clearTimeout(textTimeout)
    titleTimeout = null
    textTimeout = null
})
</script>

<template>
    <div class="head">
        <div class="head__inner">
            <div class="head__content">
                <h1 ref="titleRef" class="title head__title">
                    {{ props.title }}
                </h1>

                <p ref="textRef" class="head__text">
                    {{ props.text }}
                </p>

                <div class="head__img">
                    <img src="@assets/icons/blob.svg" alt="blob" loading="lazy">
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped lang="scss">
.head {
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    transition: all .4s ease;
    margin-bottom: 100px;

    &__inner {
        position: relative;
        padding: 10px;
        z-index: 2;
        @include media-lg {
            padding: 20px;
        }
    }

    &__title {
        font-family: 'Italiana', sans-serif;
        color: $accent-color;
        font-size: 52px;
        font-weight: 700;
        letter-spacing: 4px;
        margin-bottom: 30px;
        line-height: 110%;

        @include media-sm {
            font-size: 64px;
        }
        @include media-md {
            font-size: 88px;
        }
        @include media-lg {
            font-size: 110px;
        }
    }

    &__title-line {
        display: block;
        overflow: hidden;
    }

    &__title-word {
        display: inline-block;
    }

    &__content {
        position: relative;
        display: flex;
        flex-direction: column;
        min-height: calc(100vh - 20px);
        padding: 180px 20px 80px;
        border-radius: 20px;
        border: 2px solid $primary-color;
        overflow: hidden;

        @include media-lg {
            min-height: calc(100vh - 40px);
            border-width: 4px;
            padding: 180px 50px 80px;
        }
    }

    &__img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        filter: blur(3px);

        @include media-md {
            width: 140%;
            height: 140%;
        }
        
        @include media-lg {
            width: 200%;
            height: 200%;
        }

        & img {
            object-fit: cover;
            height: 100%;
            width: auto;
            animation: rotate 10s linear infinite;
        }
    }

    &__text {
        font-size: 18px;
        font-style: italic;
        font-weight: 300;
        color: $accent-color;
        letter-spacing: 2px;
        margin-bottom: auto;
        @include media-md {
            font-size: 24px;
            padding-left: 20px;
        }
    }
}

.head.scrolled {
    transition: all .4s ease;

    .head__content {
        // min-height: auto;
        padding: 20px;
        padding-top: 100px;
    }

    .head__img img {
        height: auto;
        width: 100%;
        animation: rotateCollapsed 10s linear infinite;
    }
}

@keyframes rotate {

    0%,
    100% {
        transform: translateX(-30%) rotate(0deg);
    }

    30% {
        transform: translate(-30%, -20%) rotate(180deg);
    }

    70% {
        transform: translate(-30%, 20%) rotate(360deg);
    }
}

@keyframes rotateCollapsed {

    0%,
    100% {
        transform: translate(40%, -20%) rotate(0deg);
    }
    50% {
        transform: translate(-40%, -20%) rotate(180deg);
    }
}
</style>
