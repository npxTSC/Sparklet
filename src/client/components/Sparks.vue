<script setup lang="ts">
import TopBar from "./TopBar.vue";

defineProps<{ account: any }>();
</script>

<template>
    <TopBar :account />

    <div class="bb1 mb-5 pb-2">
        <h1 class="title display-1 text-white center">Spark Catalog</h1>
        <h2 class="bigsubtitle center">Recent experiments</h2>
    </div>

    <div class="bb1">
        <!-- <% for (qpost of qposts) { %> -->
        <!-- <% date=new Date(qpost.date * 1000) %> -->
        <!-- <a href="/sparks/<%= qpost.uuid %>" class="nodec"> -->
        <!--     <div class="qpostBox"> -->
        <!--         <h2 class="fst-italic text-white">"<%= qpost.title %>"</h2> -->
        <!--         <h3 class="fst-italic text-white"> -->
        <!--             from <%= qpost.creatorName %><br /><br /> -->
        <!--                 Posted on <%= date.toLocaleDateString() %> at <%= date.toLocaleTimeString(undefined, -->
        <!--                         {timeZone: "America/New_York" }) %> -->
        <!--         </h3> -->
        <!--     </div> -->
        <!-- </a> -->
        <!-- <% } %> -->
    </div>
</template>
