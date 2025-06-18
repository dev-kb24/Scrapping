<template>
    <div v-html="compiledText"></div>
</template>

<script setup lang="ts">
    import { marked } from "marked";
import { computed } from "vue";
    const props = defineProps({
        content: {
            type: String,
            required: true
        }
    })
 const compiledText =  computed(() => {
        return marked(props.content);
    })
</script>