<script setup lang="ts">
// defineProps<{
//   msg: string
// }>()
</script>

<template>
    <div id="topbar">
        <img src="../assets/zap.png" class="logo" alt="logo" />
        <ul>
            <li><a href="/">Sparklet</a></li>
            <li><a href="/about">About</a></li>
        </ul>
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

#topbar {
    display: block;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: @col-goldenrod;
    border: 0 solid black;

    &>img.logo {
        display: inline;
        float: left;
        // width: 8vw;
        height: 4em;
        margin: 1vw;
    }

    &>ul {
        display: inline;
        list-style-type: none;

        &>li:first-child a {
            font-weight: 500;
        }

        &>li a {
            color: black;
            text-align: center;
            text-decoration: none;
        }

        // desktop
        @media only screen and (min-width: (@mobile-max-width + 1px)) {
            border-bottom-width: 1vh;

            &>li {
                float: left;

                a {
                    display: inline-block;
                    padding: 3vh;
                    font-size: 5vh;
                }
            }
        }

        // mobile
        @media only screen and (max-width: @mobile-max-width) {
            display: inline-flex;
            justify-content: space-between;
            border-bottom-width: 1vw;

            &>li a {
                display: block;
                padding: 2.3vw;
                font-size: 4.5vw;
            }
        }
    }
}
</style>
