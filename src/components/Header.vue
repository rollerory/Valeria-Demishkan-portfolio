<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

const route = useRoute();
const router = useRouter();

const props = defineProps({
    isRow: Boolean,
    isBorderChange: Boolean
});

const headerEl = ref();
const activeSection = ref('home');

const isProjectPage = computed(() => route.path.startsWith('/project'));
const isTraineePage = computed(() => route.path.startsWith('/trainee'));

const isFixed = computed(() => props.isRow || isProjectPage.value || isTraineePage.value);
const isBorder = computed(() => props.isBorderChange || isProjectPage.value || isTraineePage.value);

const getMenuHref = (sectionId: string) => {
    return route.path === '/' ? `#${sectionId}` : `/#${sectionId}`;
};

const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);

    if (!element) return;

    const offsetTop = element.offsetTop - 100;

    window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
    });
};

const handleMenuClick = async (sectionId: string) => {
    if (route.path === '/') {
        scrollToSection(sectionId);
        return;
    }

    await router.push({
        path: '/',
        hash: `#${sectionId}`
    });
};

const updateActiveSection = () => {
    if (route.path !== '/') return;

    const sections = ['home', 'comercial', 'trainee'];
    const scrollPosition = window.scrollY + 150;

    for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i];
        if (!id) continue;

        const element = document.getElementById(id);

        if (element && element.offsetTop <= scrollPosition) {
            activeSection.value = id;
            break;
        }
    }
};

onMounted(() => {
    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection();

    if (route.hash) {
        const id = route.hash.replace('#', '');

        nextTick(() => {
            setTimeout(() => {
                scrollToSection(id);
            }, 100);
        });
    }
});

onUnmounted(() => {
    window.removeEventListener('scroll', updateActiveSection);
});

watch(() => props.isRow, () => {
    const state = Flip.getState('.header__menu-list li');

    nextTick(() => {
        Flip.from(state, {
            duration: 0.3,
            ease: "power2.inOut",
            stagger: 0.1
        });

        gsap.to(headerEl.value, {
            duration: 0.3,
            ease: "power2.inOut"
        });
    });
});

watch(
    () => route.fullPath,
    () => {
        if (route.path !== '/' || !route.hash) return;

        const id = route.hash.replace('#', '');

        nextTick(() => {
            setTimeout(() => {
                scrollToSection(id);
            }, 100);
        });
    }
);
</script>

<template>
    <div class="header" ref="headerEl" :class="{
        fixed: isFixed,
        'border-change': isBorder
    }">
        <div class="header__inner">
            <nav class="header__menu">
                <ul class="header__menu-list" :class="{ row: props.isRow || isProjectPage || isTraineePage}">
                    <li>
                        <a :href="getMenuHref('home')" @click.prevent="handleMenuClick('home')"
                            :class="{ active: activeSection === 'home' }">
                            Home
                        </a>
                    </li>

                    <li>
                        <a :href="getMenuHref('comercial')" @click.prevent="handleMenuClick('comercial')"
                            :class="{ active: activeSection === 'comercial' }">
                            Comercial
                        </a>
                    </li>

                    <li>
                        <a :href="getMenuHref('trainee')" @click.prevent="handleMenuClick('trainee')"
                            :class="{ active: activeSection === 'trainee' }">
                            Trainee
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<style scoped lang="scss">
.header {
    position: absolute;
    bottom: 65px;
    left: 36px;
    z-index: 20;
    border: transparent 2px solid;
    padding: 0;

    @include media-lg {
        left: 80px;
    }

    &__menu-list {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 40px;

        &.row {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            @include media-sm {
                justify-content: flex-start;
                gap: 40px;
            }
        }

        & li {
            flex-shrink: 0;
            a {
                text-decoration: none;
                color: $text-color;
                font-size: 20px;
                transition: all .3s ease;
                
                @include media-md {
                    font-size: 28px;
                }
                
                &:hover {
                    color: $primary-color;
                }
            }
        } 

        & li a.active {
            position: relative;
            color: $primary-color;
            padding-right: 30px;

            &::after {
                content: '/';
                position: absolute;
                font-size: 28px;
                font-weight: 200;
                top: 50%;
                right: 0;
                transform: translateY(-45%);
                transition: all .3s ease;
            }
        }
    }

    &.fixed {
        width: calc(100% - 20px);
        height: fit-content;
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 36px;
        border-radius: 20px;
        border: 2px solid transparent;
        transition: border-color 0.5s ease;

        @include media-sm {
            width: max-content;
        }

        // @include media-lg {
        //     padding: 10px 80px;
        // }

        &.border-change {
            // border-color: $primary-color;
            border: 2px solid $primary-color;
            background: #fff;
        }
    }
}
</style>
