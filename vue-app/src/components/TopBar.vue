<script setup lang="ts">
// defineProps<{
//   msg: string
// }>()
</script>

<template>
    <div>
        <img src="../assets/zap.png" alt="logo" />
        <h1 class="green">1</h1>
        <h3>2</h3>
    </div>
</template>

<style lang="less">
@mobile-max-width: 768px;
@col-goldenrod: #ffe600;
@spark-yellow: #f0e130;
// @bg-dark: 0.7;

.nav-link {
    filter: brightness(100%);
    background: @spark-yellow;
    transition: filter 0.2s ease-in-out;
    outline: none;

    &:hover,
    &:focus,
    &:active {
        filter: brightness(90%);
        transition: filter 0.2s ease-in-out;
    }
}

ul#topbar {
    display: block;
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: fixed;
    top: 0;
    width: 100%;
    background-image: linear-gradient(#000, @col-goldenrod);
    border: 0 solid black;

    &>* a {
        // A tags inside the navbar
        color: white;
        text-align: center;
        text-decoration: none;

        &:hover {
            background-image: linear-gradient(#0c0c0c, @col-goldenrod);
            text-shadow: 0 0.4vh #000;
        }
    }

    // desktop
    @media only screen and (min-width: (@mobile-max-width + 1px)) {
        border-bottom-width: 1vh;

        &>* {
            float: left;

            a {
                display: inline-block;
                padding: 3vh;
                font-size: 5vh;
                font-weight: 500;
            }
        }
    }

    // mobile
    @media only screen and (max-width: @mobile-max-width) {
        display: inline-flex;
        justify-content: space-between;
        border-bottom-width: 1vw;

        &>* a {
            display: block;
            padding: 2.3vw;
            font-size: 4.5vw;
            font-weight: 600;
        }
    }



}
</style>
