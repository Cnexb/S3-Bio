<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const modules = import.meta.glob('../data/*.json', { eager: true, import: 'default' }) as Record<string, SlideCanvas>

interface PptElement {
  id: string
  type: 'text' | 'image' | 'shape'
  left: number
  top: number
  width: number
  height: number
  rotate?: number
  click?: number
  initialHidden?: boolean
  animation?: string
  text?: string
  src?: string
  fontSize?: number
  color?: string
  fill?: string
}

interface SlideCanvas {
  index: number
  background?: string | null
  elements: PptElement[]
  clickCount: number
}

const { $frontmatter } = useSlideContext()

const canvas = computed<SlideCanvas | null>(() => {
  const key = String($frontmatter.canvas || '')
  if (!key) return null
  const filename = key.split('/').pop() || key
  return modules[`../data/${filename}`] || null
})

const bgStyle = computed(() => {
  const bg = canvas.value?.background
  if (!bg) return {}
  if (bg.startsWith('#')) return { backgroundColor: bg }
  return {
    backgroundImage: `url(${bg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
})

function elStyle(el: PptElement) {
  return {
    left: `${el.left}%`,
    top: `${el.top}%`,
    width: `${el.width}%`,
    height: `${el.height}%`,
    transform: el.rotate ? `rotate(${el.rotate}deg)` : undefined,
    zIndex: el.type === 'text' ? 2 : 1,
  }
}

function textStyle(el: PptElement) {
  const fs = el.fontSize || 18
  return {
    fontSize: `${(fs / 720) * 100}vmin`,
    color: el.color || '#1a1a1a',
    lineHeight: 1.15,
    whiteSpace: 'pre-wrap' as const,
  }
}

function clickAt(el: PptElement) {
  return el.click && el.click > 0 ? el.click : 1
}
</script>

<template>
  <div class="slidev-layout ppt-canvas-layout">
    <div v-if="canvas" class="ppt-slide" :style="bgStyle">
      <template v-for="el in canvas.elements" :key="el.id">
        <!-- Images -->
        <template v-if="el.type === 'image'">
          <img
            v-if="!el.initialHidden"
            class="ppt-el ppt-anim-fade"
            :style="elStyle(el)"
            :src="el.src"
            alt=""
            loading="lazy"
          />
          <img
            v-else
            v-click="clickAt(el)"
            class="ppt-el ppt-anim-fade"
            :style="elStyle(el)"
            :src="el.src"
            alt=""
            loading="lazy"
          />
        </template>

        <!-- Shapes -->
        <template v-else-if="el.type === 'shape'">
          <div
            v-if="!el.initialHidden"
            class="ppt-el ppt-shape ppt-anim-fade"
            :style="{ ...elStyle(el), backgroundColor: el.fill }"
          />
          <div
            v-else
            v-click="clickAt(el)"
            class="ppt-el ppt-shape ppt-anim-fade"
            :style="{ ...elStyle(el), backgroundColor: el.fill }"
          />
        </template>

        <!-- Text -->
        <template v-else>
          <div
            v-if="!el.initialHidden"
            class="ppt-el ppt-text ppt-anim-fade"
            :style="{ ...elStyle(el), ...textStyle(el) }"
          >
            {{ el.text }}
          </div>
          <div
            v-else
            v-click="clickAt(el)"
            class="ppt-el ppt-text ppt-anim-fade"
            :style="{ ...elStyle(el), ...textStyle(el) }"
          >
            {{ el.text }}
          </div>
        </template>
      </template>
    </div>
    <div v-else class="ppt-slide ppt-missing">Missing canvas data</div>
  </div>
</template>

<style scoped>
.ppt-canvas-layout {
  height: 100%;
  width: 100%;
  padding: 0 !important;
}

.ppt-slide {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  background: #fff;
}

.ppt-el {
  position: absolute;
  box-sizing: border-box;
  transform-origin: center center;
}

.ppt-text {
  display: flex;
  align-items: center;
  font-family: Inter, 'PingFang TC', 'Microsoft JhengHei', sans-serif;
  font-weight: 600;
  overflow: hidden;
}

.ppt-shape {
  border-radius: 50%;
}

.ppt-missing {
  display: grid;
  place-items: center;
  color: #888;
}
</style>

<style>
.ppt-deck .slidev-layout.ppt-canvas-layout {
  padding: 0 !important;
}

.ppt-deck .ppt-anim-fade.slidev-vclick-target.slidev-vclick-hidden {
  opacity: 0 !important;
}

.ppt-deck .ppt-anim-fade.slidev-vclick-target {
  transition: opacity 0.45s ease;
}
</style>
