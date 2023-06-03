// JS that runs on almost ALL pages on the site.
"use strict";

import {cmon}		from "libdx";

// Get all cookies
const cookies = cmon.parse(document.cookie);

// Made all "backbuttons" send you back on click
for (let el of document.getElementsByClassName("backbutton")) {
  el.addEventListener("click", history.back);
}

