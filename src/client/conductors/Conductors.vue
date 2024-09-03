<script setup lang="ts">
import { ref } from "vue";
import TopBar from "/components/TopBar.vue";
import ProfilePic from "/components/ProfilePic.vue";
</script>

<template>
    <TopBar />

    <div class="bb1" style="margin-bottom: 5%;">
        <div class="container bg-black border border-primary pb-3">
            <h1 class="display-1 center text-white mb-5">
                <span class="profile-rank">
                    <!-- {{ ["User", "Mod", "Admin"][profileInfo.adminRank] }} -->
                    User
                </span>
                <span class="profile-name">
                    <!-- {{ profileInfo.name }} -->
                    refcherry
                </span>
            </h1>

            <div class="text-center mb-4">
                <ProfilePic :uuid="'anon'" :glow="true" :diameter="400" />
            </div>

            <div class="col-8 mx-auto bg-carbon border border-primary
				text-white text-center pb-3">
                <p class="display-3">-About-</p>
                <p class="profile-bio">
                    <!-- <%= profileInfo.bio ?? "This user has not written a bio yet..." %> -->
                    This user has not written a bio yet...
                </p>
            </div>
        </div>
    </div>
</template>
