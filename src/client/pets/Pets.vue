<script setup lang="ts">
// import { ref } from "vue";
</script>

<script lang="ts" defer>
console.log(
    "If you're reading this, you're probably the type of person " +
    "to really enjoy this game. Trust me, it'll be out eventually." +
    "\n\n- Leo",
);
</script>

<template>
    <div class="container my-8 mb-8 pb-5">
        <h1 class="display-1 text-white center mb-5">P/E/T/S</h1>
        <h2 class="display-4 text-white center strike">12/04/2028</h2>
        <h3 class="display-6 text-white center">Coming Soon...</h3>
        <p class="text-white center pt-8">
            {{ "&#8964; ".repeat(37).trim() }}
        </p>
    </div>

    <div class="container mb-8 pb-8">
        <h4 class="display-4 text-white center">
            Welcome to Corr Valley.
        </h4>
        <h6 class="display-6 text-primary center">
            Innovation begins here...
        </h6>

        <div class="d-block my-8 mx-auto text-center">
            <img class="align-bottom" width="90" height="144" src="/pets/ethan-surprised.png">
            <img class="align-bottom" width="90" height="174" src="/pets/siva-angle.png">
        </div>
    </div>

    <div class="container mb-8 pb-8">
        <img class="mx-auto d-block" width="198" height="96" src="/pets/rodrick-sign.png">
        <p class="text-white center">
            "Would you like to play this game?"
        </p>

        <div class="mx-auto center">
            <button class="btn btn-success">NO</button>
            <button class="btn btn-danger">NO</button>
        </div>
    </div>

    <div class="container pt-8 mb-6 pb-5">
        <p class="text-white center mb-8">
            sl33p.
        </p>
        <img class="float-end d-block" width="198" height="96" src="/pets/mira-sl33p.png">
    </div>

    <div id="bottombar">
        <img src="/pets/combo-note.png">
    </div>
</template>

<style lang="scss">
// P/E/T/S Info Page

body {
    background: #1d1d1d;
}

body img {
    image-rendering: pixelated;
}

div#bottombar {
    //overflow: hidden;
    position: fixed;
    bottom: 0;
    pointer-events: none;
    height: 10vh;
    width: 100%;
    background-image: linear-gradient(to top, orange 0%,
            rgba(255, 165, 0, 20) 5%,
            rgba(255, 165, 0, 0) 50%);
}

div#bottombar>img {
    margin-bottom: 0;
    bottom: 80%;
    vertical-align: bottom;
    position: relative;
    animation-name: slide;
    animation-duration: 20s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    width: 10%;
}

@keyframes slide {
    from {
        left: 110%;
    }

    to {
        left: -100%;
    }
}
</style>
