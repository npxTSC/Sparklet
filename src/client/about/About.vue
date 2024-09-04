<script setup lang="ts">
import { ref } from "vue";
import TopBar from "/components/TopBar.vue";

import accountStore from "/components/accounts";
const account = accountStore.account;
</script>

<template>
    <TopBar />

    <div class="bb1 pb-2">
        <h1 class="title display-1 text-white center">About</h1>
        <h2 class="bigsubtitle center">WTF is this?</h2>
    </div>

    <div class="container-fluid py-5 bg-primary vert-border-black border-bottom-0">
        <div class="container bg-carbon text-white rounded mt-4 py-2">
            <h5 class="display-5">What is this site?</h5>
            <hr>
            <p class="formal-text">
                I post my TypeScript / JavaScript experiments and labs on here once
                in a while. The site is constantly being edited, so the next time you
                come here, it probably won't be the exact same as it is now.
            </p>
            <p class="formal-text">
                If you're here for curiosity, check out the
                <a href="/sparks/">sparks</a> page.

                If you're here from my resume or, to be quite honest, just want
                something with a little more effort put into it, maybe take a look
                at the <a href="/portfolio/">portfolio</a> page.
            </p>
            <hr>
            <p class="formal-text">
                The site is built with Vue 3, Bootstrap, Sass, and TypeScript, and
                the backend is built with Node.js and Express. The site is hosted
                on my Vultr VPS via a docker container.
            </p>
            <p class="formal-text">
                You can create an account if you want, but it's not required unless
                you want to use the incomplete `Rooms` feature.
                Remember to never reuse passwords!
            </p>
        </div>
    </div>
</template>
