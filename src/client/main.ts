import "./style.scss";

import { createApp } from "vue";

import App from "./App.vue";

document.head.innerHTML += `
    <meta charset="UTF-8" />

    <title>Sparklet | Check it out!</title>
    <meta name="description" content="Experimental website. Always broken, never to be fully fixed! :D" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="icon" type="image/png" href="/img/favicon.png?v=1" />
    <link rel="shortcut icon" type="image/x-icon" href="/img/favicon.png?" />
    <link rel="apple-touch-icon" href="/img/favicon.png?" />

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa" crossorigin="anonymous"
        defer></script>
    `


createApp(App).mount("#app");
