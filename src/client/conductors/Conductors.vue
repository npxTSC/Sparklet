<script setup lang="ts">
import { ref } from "vue";
import TopBar from "/components/TopBar.vue";
import ProfilePic from "/components/ProfilePic.vue";
import { username2Account } from "/components/accounts";

const profile = ref(null);

(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const profileName = urlParams.get('user');

    profile.value = await username2Account(profileName);
})();
</script>

<template>
    <TopBar />

    <div class="bb1" style="margin-bottom: 5%;">
        <div v-if="profile" class="container bg-black border border-primary pb-3">
            <h1 class="display-1 center text-white mb-5">
                <span class="profile-rank">
                    {{ ["User", "Mod", "Admin"][profile.adminRank] + " " }}
                </span>

                <span class="profile-name">
                    {{ profile.name }}
                </span>
            </h1>

            <div class="text-center mb-4">
                <ProfilePic :uuid="profile.uuid" :glow="true" :diameter="400" />
            </div>

            <div class="col-8 mx-auto bg-carbon border border-primary
                    text-white text-center pb-3">
                <p class="display-3">-About-</p>
                <p class="profile-bio">
                    {{ profile?.bio || "This user has not written a bio yet..." }}
                </p>
            </div>
        </div>
    </div>
</template>
