<script setup lang="ts">
import { ref } from "vue";
import TopBar from "/components/TopBar.vue";

import accountStore from "/components/accounts";
const account = accountStore.account;
</script>

<template>
    <TopBar />

    <div class="bb1" style="margin-bottom: 5%;">
        <h1 class="title center text-white">Sparklet Login</h1>
    </div>

    <div class="bb1 container">
        <form ref="loginForm" action="/api/accounts/login" method="post" class="mb-6">
            <div class="form-group mx-auto mb-4">
                <input class="form-control" name="username" placeholder="Username" type="text">
            </div>

            <div class="form-group mx-auto mb-4">
                <input class="form-control" name="password" placeholder="Password" type="password">
            </div>

            <button type="submit" name="log in" class="btn btn-primary border-black mx-auto">
                Log In
            </button>
            <button type="submit" name="register" class="btn btn-primary border-black mx-auto">
                Register
            </button>
            <button v-if="account" type="submit" name="log out" class="btn btn-primary border-black mx-auto">
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

<script lang="ts" defer>
export default {
    mounted() {
        const form = this.$refs.loginForm;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            // stupid thing, it no workie
            // const formData = new FormData(form);

            const formData = {
                username: form.username.value,
                password: form.password.value,
                loginAction: e.submitter.name,
            };

            const response = await fetch(form.action, {
                method: form.method,
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json", },
            });

            if (response.status !== 200) {
                return console.log("Error submitting form. Code: " + response.status);
            }

            const data = await response.json();
            if (data.success) {
                accountStore.account = data.account;
            }
        });
    },
};
</script>
