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

        <div class="container bg-primary rounded pt-1 invisible" ref="errorCodeBox">
            <p class="display-6 text-black" ref="errorCodeText">//</p>
        </div>
    </div>
</template>

<script lang="ts" defer>
export default {
    mounted() {
        const form = this.$refs.loginForm;
        const ecBox = this.$refs.errorCodeBox;
        const ecText = this.$refs.errorCodeText;

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

            const data = await response.json();

            if (data.error) {
                console.log("Error submitting form. Code: " + response.status);
                ecBox.classList.remove("invisible");
                ecText.textContent = data.error;
            } else {
                console.log("Form submitted successfully. Account updated.");
                accountStore.account = data.account;

                window.location.href = `/`;
            }
        });
    },
};
</script>
