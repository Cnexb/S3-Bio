<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useNav } from '@slidev/client'

interface DeckPage {
  page: number
  thumb: string
  label: string
}

const { currentPage, total, go } = useNav()
const hidden = ref(false)
const thumbs = ref<DeckPage[]>([])

const pages = computed(() => {
  if (thumbs.value.length) return thumbs.value
  return Array.from({ length: total.value }, (_, i) => ({
    page: i + 1,
    thumb: '',
    label: `Page ${i + 1}`,
  }))
})

function toggleSidebar() {
  hidden.value = !hidden.value
  try {
    localStorage.setItem('ch5-sidebar-hidden', hidden.value ? '1' : '0')
  } catch {
    /* ignore */
  }
}

function goto(page: number) {
  go(page)
}

onMounted(async () => {
  try {
    hidden.value = localStorage.getItem('ch5-sidebar-hidden') === '1'
  } catch {
    /* ignore */
  }

  try {
    const res = await fetch('/data/deck-pages.json')
    if (res.ok) {
      const data = await res.json()
      thumbs.value = data.pages.map((p: { page: number; thumb: string; label: string }) => ({
        page: p.page,
        thumb: p.thumb,
        label: p.label || `Page ${p.page}`,
      }))
    }
  } catch {
    /* ignore */
  }

  if (!document.querySelector('link[href="/draw-tool.css"]')) {
    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = '/draw-tool.css'
    document.head.appendChild(css)
  }

  if (!document.querySelector('script[src="/draw-tool.js"]')) {
    const script = document.createElement('script')
    script.src = '/draw-tool.js'
    script.defer = true
    document.body.appendChild(script)
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'b' || e.key === 'B') {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      e.preventDefault()
      toggleSidebar()
    }
  })
})

watch(currentPage, (page) => {
  const btn = document.querySelector(`.deck-sidebar-item[data-page="${page}"]`)
  btn?.scrollIntoView({ block: 'nearest' })
})
</script>

<template>
  <div class="ch5-shell" :class="{ 'sidebar-hidden': hidden }">
    <aside class="deck-sidebar">
      <div class="deck-sidebar__head">
        <h2>Pages · 頁面</h2>
        <div class="deck-sidebar__meta">
          <span>{{ total }}</span>
          <button type="button" class="sidebar-toggle" title="Hide sidebar (B)" @click="toggleSidebar">✕</button>
        </div>
      </div>
      <nav class="deck-sidebar__nav">
        <button
          v-for="p in pages"
          :key="p.page"
          type="button"
          class="deck-sidebar-item"
          :class="{ 'is-active': p.page === currentPage }"
          :data-page="p.page"
          :title="p.label"
          @click="goto(p.page)"
        >
          <span class="sidebar-num">{{ p.page }}</span>
          <span v-if="p.thumb" class="sidebar-thumb">
            <img :src="p.thumb" alt="" loading="lazy">
          </span>
          <span class="sidebar-label">{{ p.label }}</span>
        </button>
      </nav>
    </aside>
    <button
      v-if="hidden"
      type="button"
      class="sidebar-fab"
      title="Show sidebar (B)"
      @click="toggleSidebar"
    >
      ☰
    </button>
  </div>
</template>

<style scoped>
.ch5-shell {
  --sidebar-w: 340px;
  pointer-events: none;
}

.deck-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--sidebar-w);
  z-index: 200;
  background: rgba(255, 255, 255, 0.98);
  border-right: 1px solid rgba(193, 198, 213, 0.55);
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  transition: transform 0.25s ease, opacity 0.2s ease;
  box-shadow: 2px 0 14px rgba(0, 0, 0, 0.04);
}

.ch5-shell.sidebar-hidden .deck-sidebar {
  transform: translateX(calc(-1 * var(--sidebar-w)));
  opacity: 0;
  pointer-events: none;
}

.deck-sidebar__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.65rem 0.8rem;
  border-bottom: 1px solid rgba(193, 198, 213, 0.45);
  background: #f7f9fb;
}

.deck-sidebar__head h2 {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
  color: #004e9f;
}

.deck-sidebar__meta {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.82rem;
  color: #414753;
}

.sidebar-toggle,
.sidebar-fab {
  border: 1px solid #c1c6d5;
  background: #fff;
  border-radius: 0.4rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #004e9f;
  cursor: pointer;
  pointer-events: auto;
}

.sidebar-fab {
  position: fixed;
  left: 0.45rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 201;
  border-radius: 0 0.45rem 0.45rem 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.08);
}

.deck-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: 0.45rem 0.5rem;
}

.deck-sidebar-item {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  width: 100%;
  padding: 0.45rem 0.55rem;
  margin-bottom: 0.18rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.deck-sidebar-item.is-active {
  background: rgba(0, 78, 159, 0.12);
  border-color: rgba(0, 78, 159, 0.35);
}

.sidebar-num {
  width: 1.65rem;
  font-size: 0.78rem;
  font-weight: 800;
  color: #004e9f;
  text-align: center;
  flex-shrink: 0;
  padding-top: 0.15rem;
}

.sidebar-thumb {
  width: 3.4rem;
  height: 2.15rem;
  border-radius: 0.32rem;
  overflow: hidden;
  background: #eef2f6;
  border: 1px solid rgba(193, 198, 213, 0.5);
  flex-shrink: 0;
}

.sidebar-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-label {
  flex: 1;
  min-width: 0;
  font-size: 0.78rem;
  line-height: 1.35;
  color: #414753;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<style>
.ppt-image-deck #slide-content,
.ppt-image-deck .slidev-slide-container,
.ppt-image-deck .slidev-page,
.ppt-image-deck .slidev-layout,
.ppt-image-deck .slide-container,
.ppt-image-deck .slidev-slide-content,
.ppt-image-deck #slideshow,
.ppt-image-deck #app,
.ppt-image-deck #page-root {
  background: #fff !important;
}

.ppt-image-deck,
.ppt-image-deck * {
  transition: none !important;
  animation: none !important;
}

.ppt-image-deck {
  --slidev-transition-duration: 0ms !important;
}

.ppt-image-deck .slidev-page {
  transition: none !important;
}

.ppt-image-deck .slidev-icon-btn {
  z-index: 150;
}
</style>
