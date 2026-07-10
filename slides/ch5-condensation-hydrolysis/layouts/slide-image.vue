<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $frontmatter, $clicks } = useSlideContext()

const frames = computed(() => {
  const raw = $frontmatter.frames
  if (Array.isArray(raw) && raw.length) return raw as string[]
  const img = String($frontmatter.image || '')
  return img ? [img] : []
})

const activeIndex = computed(() => {
  const list = frames.value
  if (!list.length) return 0
  return Math.min(Math.max($clicks.value, 0), list.length - 1)
})

function preload(src: string) {
  const img = new Image()
  img.decoding = 'async'
  img.src = src
}

onMounted(() => {
  frames.value.forEach(preload)
})

watch(frames, (list) => {
  list.forEach(preload)
}, { immediate: true })
</script>

<template>
  <div class="slidev-layout slide-image-layout">
    <img
      v-for="(src, index) in frames"
      :key="src"
      class="slide-image"
      :class="{ 'is-active': index === activeIndex }"
      :src="src"
      alt=""
      draggable="false"
      decoding="async"
    >
  </div>
</template>

<style scoped>
.slide-image-layout {
  padding: 0 !important;
  margin: 0 !important;
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
  overflow: hidden;
}

.slide-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  background: #fff;
  opacity: 0;
  visibility: hidden;
  transition: none !important;
  animation: none !important;
}

.slide-image.is-active {
  opacity: 1;
  visibility: visible;
  z-index: 1;
}
</style>

<style>
.ppt-image-deck .slidev-layout.slide-image-layout {
  padding: 0 !important;
  background: #fff !important;
}
</style>
