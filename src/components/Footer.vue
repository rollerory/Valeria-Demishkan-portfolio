<template>
  <footer ref="footerEl" class="footer">
    <div class="container">
      <div class="footer__inner">
        <p class="footer__text">Contact me:</p>
        <div class="footer__links">
          <a
            id="telegram"
            target="_blank"
            href="https://t.me/vareliia"
            class="footer__link"
          >
            <img src="@/assets/icons/telegram.svg" alt="telegram icon">
        </a>
        <a
        id="instagram"
        target="_blank"
        href="https://www.instagram.com/_leeeraa__?igsh=MTA1MTNsd2YzOW82Ng=="
        class="footer__link"
        >
        <img src="@/assets/icons/instagram.svg" alt="instagram icon">  
    </a>
    <a
    id="behance"
    target="_blank"
    href="https://www.behance.net/27cf31c8?fbclid=PAZXh0bgNhZW0CMTEAAaYe3maau7Y3BXImyItrKFhe1NrAWC4A020VcrZ50aNG6fsBGAxva1ln2Bg_aem_2IeG5xekTFrSii1iUUBDXg"
    class="footer__link"
    >
    <img src="@/assets/icons/behance.svg" alt="behance icon">  
    
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const footerEl = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!footerEl.value) return;

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting) {
        footerEl.value?.classList.add("is-visible");
        observer?.disconnect();
      }
    },
    { threshold: 0.2 }
  );

  observer.observe(footerEl.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<style scoped lang="scss">
.footer {
  background: $primary-color;
  color: #ffffff;
  padding: 50px 0;
  &__text {
    margin-bottom: 12px;
  }
  &__links {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  &__link {
    max-width: 40px;
    width: 100%;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.6s ease, transform 0.6s ease;
    & img {
      width: 100%;
      height: 100%;
    }
  }

  &.is-visible {
    .footer__link {
      opacity: 1;
      transform: translateY(0);
    }
    .footer__link:nth-child(1) {
      transition-delay: 0ms;
    }
    .footer__link:nth-child(2) {
      transition-delay: 120ms;
    }
    .footer__link:nth-child(3) {
      transition-delay: 240ms;
    }
  }
}
</style>
