<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
    uuid: string,
    diameter: number,
    glow: boolean,
}>();

let name = ref("");

if (props.uuid === "anon") {
    name.value = "anonymous";
} else {
    fetch("/api/accounts/by-uuid?uuid=" + props.uuid).then(async (req) => {
        name.value = (await req.json()).account.name;
    });
}
</script>

<template>
    <a :href="`/conductors/${name.toLowerCase()}`">
        <img :src="`/api/profile/pfp?account=${name.toLowerCase() ?? 'anonymous'}`" :width="diameter" :height="diameter"
            :class="`profile-picture${glow ? '-big' : ''} me-3`" :alt="name + `'s PFP`">
    </a>
</template>

<style scoped lang="scss">
@import "../style.scss";

.profile-picture {
    border-radius: 50%;
    border-width: 0.2rem;
    border-color: black;
    border-style: solid;

    &-big {
        @extend .profile-picture;
        border-width: 0.4rem;
        //border-color: map-get($theme-colors, "primary");
        box-shadow: 0 0 2rem -0.5rem map-get($theme-colors, "primary");
        animation: bigPfpGlow 3s ease-in infinite alternate;
    }
}

@keyframes bigPfpGlow {
    to {
        box-shadow: 0 0 5rem 2rem map-get($theme-colors, "primary");
    }
}
</style>
