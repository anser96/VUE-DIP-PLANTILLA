<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header class="flex items-center max-h-screen leading-6 lg:pr-8">
    <img alt="Vue logo" class="block mx-auto mb-8 lg:mr-8 lg:mb-0" src="@/assets/logo.svg" width="125" height="125" />

    <div class="flex items-start flex-wrap">
      <HelloWorld msg="You did it!" />

      <nav class="w-full text-center text-xs mt-8 lg:text-left lg:ml-[-1rem] lg:text-base lg:py-4 lg:mt-4">
        <RouterLink to="/" class="inline-block px-4 border-l border-transparent first:border-0 hover:bg-transparent router-link-exact-active:text-current">Home</RouterLink>
        <RouterLink to="/about" class="inline-block px-4 border-l border-gray-300 first:border-0 hover:bg-transparent router-link-exact-active:text-current">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.router-link-exact-active {
  color: var(--color-text);
}

.router-link-exact-active:hover {
  background-color: transparent;
}
</style>