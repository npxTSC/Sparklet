<script setup lang="ts">
import { ref } from "vue";
import TopBar from "/components/TopBar.vue";

let sparks = ref([]);
fetch("/sparks.json")
    .then((res) => res.json())
    .then((data) => {
        sparks.value = data;
    });

defineProps<{ account: any }>();
</script>

<template>
    <TopBar :account />

    <div class="bb1 mb-5 pb-2">
        <h1 class="title display-1 text-white center">Spark Catalog</h1>
        <h2 class="bigsubtitle center">Recent experiments</h2>
    </div>

    <div class="bb1">
        <a v-for="spark in sparks" :key="spark.id" :href="'/sparks/' + spark.id + '/'" class="nodec">
            <div class="qpostBox">
                <h1 class="fst-italic text-white">{{ spark.title }}</h1>
                <h3 class="fst-italic text-white">
                    from {{ spark.creatorName }}<br /><br />
                </h3>
                <p class="fst-italic text-white">{{ spark.description }}</p>
            </div>
        </a>
    </div>
</template>
