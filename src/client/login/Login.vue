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
        <form action="/api/accounts/login" method="post" class="mb-6">
            <div class="form-group mx-auto mb-4">
                <input class="form-control" name="username" id="usernameBox" placeholder="Username" type="text">
            </div>

            <div class="form-group mx-auto mb-4">
                <input class="form-control" name="password" placeholder="Password" type="password">
            </div>

            <button type="submit" name="loginAction" value="log in" class="btn btn-primary border-black mx-auto">
                Log In
            </button>
            <button type="submit" name="loginAction" value="register" class="btn btn-primary border-black mx-auto">
                Register
            </button>
            <button v-if="account" type="submit" name="loginAction" value="log out"
                class="btn btn-primary border-black mx-auto">
                Log Out
            </button>

        </form>

        <p class="text-white">{{ JSON.stringify(account) }}</p>

        <div class="container bg-primary rounded
			pt-1 invisible" id="ecBox">
            <p class="display-6 text-black" id="ecText">//</p>
        </div>
    </div>
</template>
