<template>
  <editor-content :editor="(editor as Editor)" />
</template>

<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['loaded', 'removed'])

let editor = ref<Editor | null>(null)

defineExpose({
  editor,
})

onMounted(() => {
  editor.value = new Editor({
    content: '<p>Hello World!</p>',
    extensions: [StarterKit],
  })
  emit('loaded', editor.value)
})
onBeforeUnmount(() => {
  emit('removed')
  if (editor.value) {
    editor.value.destroy()
    editor.value = null
  }
})
</script>

<style>
div[contenteditable] {
  border: none;
  outline: none;
}
p {
  margin: 2px 0;
}
blockquote {
  margin: 16px 0 16px 16px;
  padding-left: 8px;
  border-left: 2px solid var(--md-sys-color-outline);
}
a {
  cursor: pointer;
  color: var(--md-sys-color-tertiary);
}
</style>
