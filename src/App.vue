<script setup lang="ts">
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconQuoteFilled,
  IconLink,
  IconBold,
  IconItalic,
  IconStrikethrough,
  IconUnderline,
  IconHeading
} from '@tabler/icons-vue';
import { ref } from 'vue'
import TipTap from './components/TipTap.vue'
import type { Editor } from '@tiptap/vue-3'

interface U2Menu extends HTMLElement {
  open: boolean
}

let editor = ref<Editor | null>(null)

function saveEditor (editorInstance: Editor): void {
  editor.value = editorInstance
  console.log('Editor loaded')
}
function removeEditor (): void {
  if (editor.value) {
    editor.value = null
    console.log('Editor removed')
  }
}
function toggleLink (): void {
  if (editor.value) {
    const selection = window.getSelection()?.toString()
    if (!selection) {
      console.warn('No text selected for link')
      return
    }
    const isLink = validate(selection)
    const isActive = editor.value.isActive('link')
    if (!isLink) {
      console.warn('Selected text is not a valid link')
      return
    }
    isActive
      ? editor.value.chain().focus().unsetLink().run()
      : editor.value.chain().focus()
        .setLink({ href: selection }).run()
  }
}
function validate (text: string): boolean {
  const regex_protocol = /(http|https):\/\/(?=\w)/g
  const regex_dot = /(\w+\.){1,}\w+/g

  const isHttpOrHttps = regex_protocol.test(text)
  const isDot = regex_dot.test(text)
  return isHttpOrHttps && isDot
}

let headline = ref<HTMLElement | null>(null)
let headlineMenu = ref<U2Menu | null>(null)

function toggleHeadlineMenu (): void {
  if (headlineMenu.value) {
    headlineMenu.value.open = !headlineMenu.value.open
  }
}

</script>

<template>
  <div class="editor-container">
    <div class="top-bar">
      <u2-field variant="filled"
        label="title"
        width="280"
      >
      </u2-field>
    </div>
    <div class="top-bar editor-actions">
      <u2-icon-button @click="editor?.commands.undo()">
        <IconArrowBackUp stroke="2" />
      </u2-icon-button>
      <u2-icon-button @click="editor?.commands.redo()">
        <IconArrowForwardUp stroke="2" />
      </u2-icon-button>
      <u2-icon-button
          @click="editor?.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor?.isActive('blockquote') }"
        >
        <IconQuoteFilled stroke="2" />
      </u2-icon-button>
      <u2-icon-button
          @click="toggleLink"
          :class="{ 'is-active': editor?.isActive('link') }"
        >
        <IconLink stroke="2" />
      </u2-icon-button>
      <u2-icon-button
          @click="editor?.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor?.isActive('bold') }"
        >
        <IconBold stroke="2" />
      </u2-icon-button>
      <u2-icon-button
          @click="editor?.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor?.isActive('italic') }"
        >
        <IconItalic stroke="2" />
      </u2-icon-button>
      <u2-icon-button
          @click="editor?.chain().focus().toggleUnderline().run()"
          :class="{ 'is-active': editor?.isActive('underline') }"
        >
        <IconUnderline stroke="2" />
      </u2-icon-button>
      <u2-icon-button
          @click="editor?.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor?.isActive('strike') }"
        >
        <IconStrikethrough stroke="2" />
      </u2-icon-button>
      <div style="position: relative;">
        <u2-icon-button id="headline-button" ref="headline"
          @click="toggleHeadlineMenu"
          @blur="headlineMenu!.open = false">
          <IconHeading stroke="2" />
        </u2-icon-button>
        <u2-menu anchor="headline-button" ref="headlineMenu">
          <u2-menu-item @click="editor?.commands.toggleHeading({ level: 1 })"
            :class="{'is-active': editor?.isActive('heading', { level: 1 }) }">
            标题 1
          </u2-menu-item>
          <u2-menu-item @click="editor?.commands.toggleHeading({ level: 2 })"
            :class="{'is-active': editor?.isActive('heading', { level: 2 }) }">
            标题 2
          </u2-menu-item>
          <u2-menu-item @click="editor?.commands.toggleHeading({ level: 3 })"
            :class="{'is-active': editor?.isActive('heading', { level: 3 }) }">
            标题 3
          </u2-menu-item>
        </u2-menu>
      </div>
    </div>
    <div class="editor-block">
      <TipTap @loaded="saveEditor" @removed="removeEditor" />
    </div>
    <div class="bottom-bar"></div>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  color: var(--md-sys-color-on-surface);
}
* {
  box-sizing: border-box;
}
.editor-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100%;
  overflow: auto;
}
.top-bar {
  position: relative;
  height: fit-content;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: var(--md-sys-color-background);
}
.top-bar:nth-child(1) {
  width: 100%;
  padding: 4px 8px;
}
.top-bar:nth-child(1) > * + * {
  margin-left: 8px;
}
.editor-actions {
  padding: 4px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom: 2px solid var(--md-sys-color-outline);
  z-index: 15;
  position: sticky;
  top: -1px;
  height: fit-content;
}
.editor-block {
  display: flex;
  flex-direction: column;
  width: 60%;
  min-width: 320px;
  margin-top: 4px;
  padding: 16px 16px;
}
@media (max-width :426px) {
  .editor-block {
    width: 100%;
  }
}

@media (prefers-color-scheme: light) {
  .editor-container { background-color: var(--md-sys-color-surface-container-highest);}
  .editor-block { background-color: var(--md-sys-color-surface-container-lowest); }
}
@media (prefers-color-scheme: dark) {
  .editor-container { background-color: var(--md-sys-color-surface-container-lowest);}
  .editor-block { background-color: var(--md-sys-color-surface-container-highest); }
}
</style>
