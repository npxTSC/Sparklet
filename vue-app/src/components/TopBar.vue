<script setup lang="ts">
// defineProps<{
//   msg: string
// }>()
</script>

<template>
    <nav class="navbar navbar-expand-sm bg-primary mb-5 vert-border-black border-top-0">
        <div class="container-fluid">
            <div class="collapse navbar-collapse">
                <a class="navbar-brand text-black" href="/">
                    <img src="/img/favicon.png" class="d-inline-block img-fluid" width="67" height="57"
                        alt="MOTHER 3 Short Circuit Zap sprite" />
                    Sparklet
                </a>
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle text-black" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown">Rooms</a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/rooms/breakout">Breakout</a></li>
                            <li><a class="dropdown-item" href="/rooms/quiz">Quiz</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="/rooms/chat">Just Chat</a></li>
                            <li><a class="dropdown-item" href="/rooms/stratus">Stratus</a></li>
                        </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link active text-black" href="/sparks">Sparks</a></li>
                    <li class="nav-item"><a class="nav-link active text-black" href="/capsules">Capsules</a></li>
                    <li class="nav-item"><a class="nav-link active text-black" href="/news">News</a></li>
                    <li class="nav-item"><a class="nav-link active text-black" href="/about">About</a></li>
                </ul>

                <!--              <a href="<%= account?.name ? -->
                <!-- `/conductors/${account.name.toLowerCase()}` : " /login" %>"> -->
                <!--                  <img <%- include("pfp-src", {pfpSrc: account?.pfpSrc}); %> -->
                <!--                  width="50" height="50" class="profile-picture me-3" alt="PFP"> -->
                <!--              </a> -->

                <a href="/login" class="btn btn-black text-primary
			active float-right ml-5">
                    <!-- <%= account?.name ?? "[Log In]" %> -->
                </a>
            </div>
        </div>
    </nav>
</template>
