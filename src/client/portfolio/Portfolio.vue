<script setup lang="ts">
// import TopBar from "/components/TopBar.vue";
//
// defineProps<{ account: any }>();
</script>

<style lang="scss">
@import "/style.scss";

body {
    background: pink;
}

.white-on-pink {
    @include kaiseiTokumin;
    color: white;

    /* text-shadow: 0.8vw 0.8vw 0.8vw #000; */
    -webkit-text-stroke: 0.05vw black;
}

.project-card {
    box-shadow: 0 0 1vw black;
    min-height: 100%;

    &>.card-body {
        display: flex;
        flex-direction: column;
    }

    & a.btn {
        margin-top: auto;
        border: 4px solid black;
        margin-bottom: 1vw;
    }
}

.project-img {
    object-fit: cover;
}
</style>

<template>
    <h1 class="mx-auto text-center py-5 white-on-pink">Some projects I've worked on...</h1>
    <div class="container">
        <div class="row">
            <div class="col-md-4">
                <div class="card project-card">
                    <img src="/img/portfolio/windot.png" class="project-img" height="250" alt="windot">
                    <div class="card-body">
                        <h5 class="card-title">windot</h5>
                        <p class="card-text">
                            A simple emoji picker for Linux, complete with skin tones,
                            searching, and recent emojis. I created it because I was
                            getting annoyed at how Emote would sometimes not register my
                            clicks properly, and I wanted to learn how to make GTK apps
                            as well, so this was the perfect way to solve 2 problems.
                        </p>
                        <a href="https://github.com/Lamby777/windot" class="btn btn-carbon">Source</a>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card project-card">
                    <img src="/img/portfolio/tql.png" class="project-img" height="250" alt="tql">
                    <div class="card-body">
                        <h5 class="card-title">TQ Launcher</h5>
                        <p class="card-text">
                            A launcher that manages your installations of TerraQuest, a
                            game made by one of my friends. It's created using Tauri, a
                            crate that allows you to create desktop applications using
                            web technologies.
                        </p>
                        <a href="https://github.com/Lamby777/tq-launcher" class="btn btn-carbon">Source</a>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card project-card">
                    <img src="/img/portfolio/pets.png" class="project-img" height="250" alt="PETS 2037">
                    <div class="card-body">
                        <h5 class="card-title">P/E/T/S 2037</h5>
                        <p class="card-text">
                            My main project right now. It's a role-playing game set in a
                            somewhat near future where you play as Ethan, a boy who needs
                            to learn to accept change. With some help from a few unlikely
                            friends, he finds his way back to his old home, only to realize
                            that the journey was more important than the destination. The
                            game is open-source, written in Godot and Rust, and almost
                            every system (dialogue, battle, etc.) was created from scratch.
                        </p>
                        <a href="https://sparklet.org/pets" class="btn btn-carbon">Status</a>
                        <a href="https://github.com/Lamby777/PETS-G" class="btn btn-carbon">Source</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-5">
            <div class="col-md-4">
                <div class="card project-card">
                    <img src="/img/portfolio/crx-fetcher.png" class="project-img" height="250" alt="CRX Fetcher">
                    <div class="card-body">
                        <h5 class="card-title">CRX-Fetcher</h5>
                        <p class="card-text">
                            A web version of a Python script I once wrote to help people
                            in class download extensions our teacher wanted us to get from
                            the Chrome Web Store, bypassing the school filters. It does this
                            by accessing some Chrome Web Store endpoint that I found off
                            Stack Overflow. You can copy a list of extension IDs and send
                            them to someone to paste in here, and it'll download all the
                            zipped packages for you to install.
                        </p>
                        <a href="https://htmlpreview.github.io/?https://github.com/Lamby777/CRX-Fetcher/blob/master/index.html"
                            class="btn btn-carbon">Try It!</a>
                        <a href="https://github.com/Lamby777/CRX-Fetcher" class="btn btn-carbon">Source</a>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card project-card">
                    <img src="/img/portfolio/cypress.png" class="project-img" height="250" alt="cypress">
                    <div class="card-body">
                        <h5 class="card-title">cypress</h5>
                        <p class="card-text">
                            A toolkit I created for hardening VMs in CyberPatriot competitions.
                            Some examples of its functions include a script to print through
                            all the users on a system and tell you which ones are admin, a
                            script to run updates and do all the typical hardening steps, and
                            a built-in guidebook/checklist for tasks that may get you points.
                        </p>
                        <a href="https://github.com/Lamby777/cypress" class="btn btn-carbon">Source</a>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card project-card">
                    <img src="/img/portfolio/timewasted.png" class="project-img" height="250" alt="timewasted.nvim">
                    <div class="card-body">
                        <h5 class="card-title">timewasted.nvim</h5>
                        <p class="card-text">
                            A very simple Neovim plugin that tells you how much time you've
                            spent using the program. I created it because I was curious
                            how Neovim plugins worked and wanted to see if I could make
                            one. The plugin itself is a reference to the bottom right
                            corner of x64dbg, a debugger I sometimes use for reverse engineering.
                        </p>
                        <a href="https://github.com/Lamby777/timewasted.nvim" class="btn btn-carbon">Source</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
