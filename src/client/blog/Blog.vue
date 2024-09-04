<script setup lang="ts">
import { ref } from "vue";
import TopBar from "/components/TopBar.vue";

import accountStore from "/components/accounts";
const account = accountStore.account;
</script>

<template>
    <TopBar />

    <div class="bb1 pb-2 mb-9">
        <h1 class="display-1 text-white center">Article Title</h1>
        <h2 class="display-6 text-white center">by refcherry</h2>
    </div>

    <div class="container-fluid py-5 bg-primary vert-border-black border-bottom-0">
        <div class="container bg-carbon text-white rounded mt-4 py-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum mollitia debitis deleniti! Vero nobis
            ullam tempore facilis illo aspernatur ab laudantium aliquid. Eum error corporis sunt dignissimos eius
            temporibus mollitia. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt eaque excepturi
            laborum, dignissimos doloribus ipsum accusamus, inventore dolorum minima ut consequuntur sit. Facilis
            blanditiis expedita accusamus voluptatem dolore labore culpa? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Vero, iste suscipit, repellendus asperiores atque vitae praesentium dolore natus velit
            eligendi dolorum! Corporis iste, similique soluta laborum beatae ipsa amet neque.
        </div>
    </div>
</template>
