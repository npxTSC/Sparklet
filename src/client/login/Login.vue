<script setup lang="ts">
import { ref } from "vue";
import TopBar from "/components/TopBar.vue";

import accountStore from "/components/accounts";
const account = accountStore.account;

let sparks = ref([]);
fetch("/sparks.json")
    .then((res) => res.json())
    .then((data) => {
        sparks.value = data;
    });
</script>

<template>
    <TopBar />

    <div class="bb1" style="margin-bottom: 5%;">
        <h1 class="title center text-white">Sparklet Login</h1>
    </div>

    <div class="bb1 container">
        <form action="/login" method="post" class="mb-5">
            <div class="form-group mx-auto mb-4">
                <input class="form-control" name="username" id="usernameBox" placeholder="Username" type="text">
            </div>

            <div class="form-group mx-auto mb-4">
                <input class="form-control" name="password" placeholder="Password" type="password">
            </div>

            <input type="submit" name="loginAction" value="Log In" class="btn btn-primary border-black mx-auto">
            <input type="submit" name="loginAction" value="Register" class="btn btn-primary border-black mx-auto">
            <input v-if="account" type="submit" name="loginAction" value="Log Out"
                class="btn btn-primary border-black mx-auto">

        </form>

        <p class="text-white">{{ JSON.stringify(account) }}</p>

        <div class="container bg-primary rounded
			pt-1 invisible" id="ecBox">
            <p class="display-6 text-black" id="ecText">//</p>
        </div>
    </div>
</template>
