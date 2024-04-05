<script setup lang="ts">
// defineProps<{
//   msg: string
// }>()
</script>

<template>
    <div class="greetings">
        <h1 class="green">3</h1>
        <h3>4</h3>
    </div>
</template>

<style scoped lang="less">
h1 {
    font-weight: 500;
    font-size: 2.6rem;
    position: relative;
    top: -10px;
}

h3 {
    font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
    text-align: center;

    @media (min-width: 1024px) {
        text-align: left;
    }
}
</style>
