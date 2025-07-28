<script setup lang="ts">
import { onMounted, ref } from "vue";
import TopBar from "/components/TopBar.vue";
import { emojify, demojify } from "discord-emoji-converter";

onMounted(() => {
    const shortcoded = document.getElementById(
        "shortcoded",
    ) as HTMLTextAreaElement;
    const emojified = document.getElementById(
        "emojified",
    ) as HTMLTextAreaElement;

    shortcoded.addEventListener("input", () => {
        emojified.value = emojify(shortcoded.value);
    });

    emojified.addEventListener("input", () => {
        shortcoded.value = demojify(emojified.value);
    });
});
</script>

<template>
    <TopBar />

    <div class="container col-10">
        <h1 class="display-1 text-center text-white mb-2">Discord Emojifier</h1>
        <div class="container row p-4 bg-white rounded">
            <textarea class="txt-split" id="shortcoded"></textarea>
            <textarea class="txt-split" id="emojified"></textarea>
        </div>
    </div>
</template>

<style lang="scss">
textarea.txt-split {
    width: 50%;
}
</style>
