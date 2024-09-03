<script setup lang="ts">
import { ref } from "vue";
import TopBar from "./TopBar.vue";

let sparks = ref([{ title: "Loading...", creatorName: "Loading...", date: 0, uuid: "Loading..." }])

fetch("/api/list-sparks")
    .then((response) => response.json())
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
        <a v-for="spark in sparks" :key="spark.uuid" :href="'/sparks/' + spark.uuid" class="nodec">
            <div class="qpostBox">
                <h2 class="fst-italic text-white">{{ spark.title }}</h2>
                <h3 class="fst-italic text-white">
                    from {{ spark.creatorName }}<br /><br />
                    Posted on {{ new Date(spark.date * 1000).toLocaleDateString() }} at {{ new Date(spark.date *
                        1000).toLocaleTimeString(undefined, { timeZone: "America/New_York" }) }}
                </h3>
            </div>
        </a>
    </div>
</template>
