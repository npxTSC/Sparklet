<script setup lang="ts">
import TopBar from "./components/TopBar.vue";
import './scss/main.scss'
import 'bootstrap'
</script>

<template>
    <TopBar />

    <div class="bb1 mb-8">
        <h1 class="bigtitle center">Sparklet</h1>
        <h2 class="bigsubtitle center">Free learning games platform</h2>
    </div>

    <div class="container-fluid mt-6 py-5 bg-primary vert-border-black border-bottom-0">
        <div class="container bg-carbon text-white rounded mt-4 py-2">
            <h5 class="display-5">What is this site?</h5>
            <p class="formal-text">
                I post my TypeScript / JavaScript experiments and labs on here once
                in a while. I'm also trying to create a quiz / flashcards section
                for reviewing class material and getting homework help. The site is
                constantly being edited, so the next time you come here, it probably
                won't be the exact same as it is now.
            </p>
            <p class="formal-text">
                You can create an account if you want, but it's not required unless
                you're a teacher trying to set up a quiz for the class to play.
                Remember to never reuse passwords!
            </p>
        </div>
    </div>
</template>
