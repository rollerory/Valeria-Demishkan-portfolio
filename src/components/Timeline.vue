<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'

import Title from './Title.vue';

gsap.registerPlugin(Draggable)

const sliderContainer = ref<HTMLElement | null>(null)
const img2 = ref<HTMLElement | null>(null)
const img3 = ref<HTMLElement | null>(null)
const handle1 = ref<HTMLElement | null>(null)
const handle2 = ref<HTMLElement | null>(null)
const divider1 = ref<HTMLElement | null>(null)
const divider2 = ref<HTMLElement | null>(null)

const currentProject = ref(0)
const projects = ref(['Corridor', 'Kitchen', 'Living Room'])

const projectName = computed(() => projects.value[currentProject.value])

let containerWidth = 600
let draggable1: any = null
let draggable2: any = null

const currentImagePath = (imageNum: number) => {
    const folder = currentProject.value + 1
    return new URL(`../assets/images/timeline/${folder}/${imageNum}.webp`, import.meta.url).href
}

const selectProject = (index: number) => {
    currentProject.value = index
}

const initSlider = () => {
    if (!sliderContainer.value || !img2.value || !img3.value) return

    containerWidth = sliderContainer.value.offsetWidth

    // Initial positions
    let pos1 = containerWidth * 0.33
    let pos2 = containerWidth * 0.66

    // Update clip-path based on position
    const updateClipPath = () => {
        if (img2.value) {
            img2.value.style.clipPath = `inset(0 0 0 ${pos1}px)`
        }
        if (img3.value) {
            img3.value.style.clipPath = `inset(0 0 0 ${pos2}px)`
        }
        if (divider1.value) {
            gsap.set(divider1.value, { x: pos1 })
        }
        if (divider2.value) {
            gsap.set(divider2.value, { x: pos2 })
        }
    }

    updateClipPath()

    // Clear existing draggables
    if (draggable1) draggable1.kill()
    if (draggable2) draggable2.kill()

    // Create draggable for handle 1
    draggable1 = Draggable.create(handle1.value, {
        type: 'x',
        bounds: sliderContainer.value,
        onDrag() {
            pos1 = this.x
            if (pos2 <= pos1 + 20) {
                pos2 = pos1 + 20
                gsap.set(handle2.value, { x: pos2 })
            }
            updateClipPath()
        },
        onDragEnd() {
            gsap.to(handle1.value, { duration: 0.3 })
        }
    })

    // Create draggable for handle 2
    draggable2 = Draggable.create(handle2.value, {
        type: 'x',
        bounds: sliderContainer.value,
        onDrag() {
            pos2 = this.x
            if (pos1 >= pos2 - 20) {
                pos1 = pos2 - 20
                gsap.set(handle1.value, { x: pos1 })
            }
            updateClipPath()
        },
        onDragEnd() {
            gsap.to(handle2.value, { duration: 0.3 })
        }
    })

    // Set initial positions
    gsap.set(handle1.value, { x: pos1 })
    gsap.set(handle2.value, { x: pos2 })
}

onMounted(() => {
    initSlider()
})
</script>

<template>
    <div class="timeline">
        <Title :title="projectName + ' - Development'" />
        <div class="timeline__content" ref="sliderContainer">
            <!-- Image 1 -->
            <div class="timeline__img timeline__img--1">
                <img
                    :src="currentImagePath(1)"
                    :alt="`Stage 1 - Project ${currentProject}`"
                    loading="lazy"
                >
            </div>

            <!-- Image 2 with clip-path -->
            <div class="timeline__img timeline__img--2" ref="img2">
                <img
                    :src="currentImagePath(2)"
                    :alt="`Stage 2 - Project ${currentProject}`"
                    loading="lazy"
                >
            </div>

            <!-- Image 3 with clip-path -->
            <div class="timeline__img timeline__img--3" ref="img3">
                <img
                    :src="currentImagePath(3)"
                    :alt="`Stage 3 - Project ${currentProject}`"
                    loading="lazy"
                >
            </div>

            <!-- Vertical divider line 1 -->
            <div class="timeline__divider timeline__divider--1" ref="divider1"></div>

            <!-- Vertical divider line 2 -->
            <div class="timeline__divider timeline__divider--2" ref="divider2"></div>

            <!-- Draggable handles -->
            <div class="timeline__handle timeline__handle--1" ref="handle1" aria-label="Drag to reveal stage 2">
                <div class="timeline__handle-line"></div>
            </div>
            <div class="timeline__handle timeline__handle--2" ref="handle2" aria-label="Drag to reveal stage 3">
                <div class="timeline__handle-line"></div>
            </div>
        </div>

        <!-- Project buttons -->
        <div class="timeline__buttons">
            <button 
                v-for="(project, idx) in projects" 
                :key="project"
                @click="selectProject(idx)"
                :class="['timeline__button', { 'timeline__button--active': currentProject === idx }]"
            >
                {{ project }}
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .timeline {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 3rem;
        z-index: 1;
        position: relative;

        &__content {
            position: relative;
            width: 100%;
            aspect-ratio: 1/1;
            overflow: visible;
            cursor: grab;
            touch-action: none;

            &:active {
                cursor: grabbing;
            }
        }

        &__img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;

            & img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                pointer-events: none;
                user-select: none;
            }

            &--1 {
                z-index: 0;
            }

            &--2 {
                clip-path: inset(0 0 0 200px);
            }

            &--3 {
                clip-path: inset(0 0 0 400px);
            }
        }

        &__divider {
            position: absolute;
            top: 0;
            left: 0;
            width: 2px;
            height: 100%;
            background: linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0.8),
                rgba(255, 255, 255, 0.6),
                rgba(255, 255, 255, 0.8)
            );
            z-index: 4;
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);

            &--1 {
                z-index: 5;
            }

            &--2 {
                z-index: 6;
            }
        }

        &__handle {
            position: absolute;
            top: 0;
            left: 0;
            width: 50px;
            height: 100%;
            transform: translateX(-25px);
            z-index: 7 !important;
            cursor: grab;
            display: flex;
            align-items: center;
            justify-content: center;

            &:active {
                cursor: grabbing;
            }

            &-line {
                width: 2px;
                height: 100%;
                background: linear-gradient(
                    to bottom,
                    rgba(255, 255, 255, 0.8),
                    rgba(255, 255, 255, 0.6),
                    rgba(255, 255, 255, 0.8)
                );
                box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
            }
        }

        &__buttons {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
        }

        &__button {
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 500;
            border: 2px solid #333;
            background: white;
            color: #333;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.3s ease;

            &:hover {
                background: #f0f0f0;
                transform: translateY(-2px);
            }

            &--active {
                background: #333;
                color: white;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }

            &--active:hover {
                background: #1a1a1a;
            }
        }
    }
</style>
