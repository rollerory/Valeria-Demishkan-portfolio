<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';
import MorphSVGPlugin from 'gsap/MorphSVGPlugin';
import defaultDark from '@img/switcher/dark.webp';
import defaultLight from '@img/switcher/light.webp';

gsap.registerPlugin(MorphSVGPlugin);

type SwitcherProps = {
    daySrc?: string;
    nightSrc?: string;
    dayAlt?: string;
    nightAlt?: string;
};

const props = withDefaults(defineProps<SwitcherProps>(), {
    daySrc: defaultLight,
    nightSrc: defaultDark,
    dayAlt: 'day',
    nightAlt: 'night',
});

const switchState = ref<boolean>(false);

const switchPhotos = () => {

    gsap.to('.switcher__btn path', {
        duration: 0.8,
        ease: 'power2.inOut',
        morphSVG: switchState.value ? '#light-bulb' : '#dark-bulb',
    });

    gsap.to('.switcher__light', {
        opacity: switchState.value ? 1 : 0,
        duration: 1,
    });

    gsap.to('.switcher__dark', {
        opacity: switchState.value ? 0 : 1,
        duration: 1,
    });

    switchState.value = !switchState.value;
};

</script>

<template>
    <div class="switcher">
        <div class="container">
            <div class="switcher__content">
                <img class="switcher__dark" :src="props.nightSrc" :alt="props.nightAlt" loading="lazy">
                <img class="switcher__light" :src="props.daySrc" :alt="props.dayAlt" loading="lazy">
            </div>
            <button class="switcher__btn" @click="switchPhotos()">
                <svg id="bulb" width="30" height="30" viewBox="0 0 64 64">
                    <path id="light-bulb" fill="#906847" d="M40,56H24c-2.211,0-4,1.789-4,4s1.789,4,4,4h16c2.211,0,4-1.789,4-4S42.211,56,40,56z
M32,0C16.539,0,4,12.539,4,28c0,9.445,4.695,17.781,11.863,22.844
C16.438,51.25,17.375,52,20,52s21.812,0,24,0s3.559-0.742,4.133-1.148
C55.305,45.781,60,37.445,60,28C60,12.539,47.461,0,32,0z
M43.891,44H36V28c0-2.211-1.789-4-4-4s-4,1.789-4,4v16h-7.891
C15.215,40.359,12,34.578,12,28c0-11.047,8.953-20,20-20s20,8.953,20,20
C52,34.578,48.785,40.359,43.891,44z" />
                    <path id="dark-bulb" fill="transparent" d="M40,56H24c-2.211,0-4,1.789-4,4s1.789,4,4,4h16c2.211,0,4-1.789,4-4S42.211,56,40,56z
M32,0C16.539,0,4,12.539,4,28c0,9.445,4.695,17.777,11.863,22.844
C16.438,51.25,17.375,52,20,52s21.812,0,24,0s3.559-0.746,4.133-1.152
C55.305,45.781,60,37.445,60,28C60,12.539,47.461,0,32,0z
M36,44h-8V24c0-2.211,1.789-4,4-4s4,1.789,4,4V44z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.switcher {
    position: relative;
    padding-bottom: 40px;
    margin-bottom: 40px;
    border-bottom: 2px solid $primary-color;
    &__content {
        position: relative;
        overflow: hidden;
        border-radius: 20px;
        width: 100%;
        max-width: 500px;
        height: 500px;
        @include media-sm {
            // width: auto;
        }

        & img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            object-fit: cover;
            pointer-events: none;
            user-select: none;

            -r: 0%;

            mask-image: radial-gradient(circle at center,
                    rgba(0, 0, 0, 1) var(--r),
                    rgba(0, 0, 0, 0) calc(var(--r) + 1%));

            -webkit-mask-image: radial-gradient(circle at center,
                    rgba(0, 0, 0, 1) var(--r),
                    rgba(0, 0, 0, 0) calc(var(--r) + 1%));
        }

        @include media-lg {
            overflow: visible;
            & img {
                border-radius: 20px;
            }
            &::after {
                content: 'day/night';
                position: absolute;
                right: -30px;
                top: 0;
                z-index: -1;
                opacity: 0.7;
                font-family: 'Italiana', sans-serif;
                font-weight: 800;
                font-style: italic;
                color: $primary-color;
                font-size: 48px;
                text-transform: uppercase;
                writing-mode: vertical-rl;
                text-orientation: upright;
                line-height: 90%;
                letter-spacing: -2px;
            }
        }
    }
    &__btn {
        padding: 7px;
        border: none;
        border-radius: 20px 20px 0 0;
        background: $background-color;
        cursor: pointer;
        position: absolute;
        top: 30px;
        left: -5px;
        transform: rotate(90deg);
        @include media-xxl {
            border-radius: 20px;
            padding: 10px;
        }
    }
}
</style>
