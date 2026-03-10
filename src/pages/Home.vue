<script setup lang="ts">
import About from '@/components/About.vue';
import Comercial from '@/components/Comercial.vue';
import HomeHead from '@/components/HomeHead.vue';
import Trainee from '@/components/Trainee.vue';
</script>

<template>
    <div class="home">
        <div id="home">
            <HomeHead title="Valeria Demishkan" text="Interior Designer portfolio"/>
        </div>
        <div id="about">
            <About />
        </div>
        <div id="comercial">
            <Comercial />
        </div>
        <div id="trainee">
            <Trainee />
        </div>
    </div>
</template>

<style scoped>

</style>
