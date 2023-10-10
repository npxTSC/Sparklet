# Sparklet Z (rewrite v3)

"Learn something new..."

## Welcome

This is a rewrite (again) of Sparklet. The original kinda sucked, and the first
rewrite, known as SparkletX(/Y...?) had a lot of tech debt built up over years
of learning TypeScript and Bootstrap and messing with different build tools and
databases. This rewrite is meant to be a fresh start, where I'll still be
learning new stuff (Vue and `actix-web`) while also making something that is
actually nice to work on and doesn't cause me to spend 20 minutes looking
through type definitions and other crap just to wrap my head around what's
wrong.

You can think of Sparklet as a sort of personal website where I host software
experiments and similar projects. It's also hopefully going to at some point
have those educational tools I promised in SparkletX. Best of all, the site is
100% freeware (no greedy subscription plans), and the backend is also completely
open-source.

## Contributions

Feel free to make pull requests, but your code has to be readable and not have
any major security vulnerabilities or performance issues.

Also, please split up your contributions into separate pull requests so I can
accept one but still put another feature on hold if it has issues.

## FOR DEVS

Check the readme inside the `vue-app` folder for frontend stuff. The backend is
fairly obvious; just compile and run with `cargo run` (or `cargo watch -x run`).
If you're running the full stack locally, it'll be on port 5001. If you're just
running the Vite dev server, it'll be on the default port of 5173.
