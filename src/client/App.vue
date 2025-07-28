<script setup lang="ts">
import TopBar from "/components/TopBar.vue";
</script>

<template>
    <TopBar />
    <div class="bb1 mb-8">
        <h1 class="bigtitle center">Sparklet</h1>
        <h2 class="bigsubtitle center">Under Renovation!</h2>
    </div>

    <div
        class="container-fluid mt-6 py-5 bg-primary vert-border-black border-bottom-0"
    >
        <div class="container bg-carbon text-white rounded mt-4 py-2">
            <h5 class="display-5">Hey!</h5>
            <p class="formal-text">
                You probably found this from my email address or my GitHub
                profile. This is a little experiment site for pretty much
                anything I want to put up on it. Confused what to do? Check out
                the <a href="/about/">About</a> page for a little more info.
            </p>
            <p class="formal-text">
                This site has consistently been accruing tech debt over the
                years as I work on other stuff and continue to ignore it. Don't
                judge it as anything serious. See issue #95 on
                <a href="https://github.com/npxTSC/Sparklet/">the repo</a>.
            </p>
        </div>
    </div>
</template>
