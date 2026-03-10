<script setup lang="ts">
import Title from '@/components/Title.vue';
</script>

<template>
    <section class="about">
        <div class="container">
            <Title title="About me" />
            <p class="about__text">
                Hello, my name is Valeriia. I’m a 22-year-old interior designer with over three years of practical experience in the field. I’ve had the opportunity to work on projects in different parts of the world, which helped me develop a flexible and global design perspective. I’m always open to new collaborations and creative challenges.
            </p>
        </div>
    </section class="about">
</template>

<style scoped lang="scss">
.about {
    &__text {
        max-width: 900px;
        width: 100%;
        text-wrap: balance;
    }
}
</style>