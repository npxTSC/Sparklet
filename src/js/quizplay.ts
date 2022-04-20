// Actual quiz code (live game)
"use strict";

import {filterStringE,
	   shakeElement}		from "../../util";
import {CookieMonster}		from "../../classes";
import {io}					from "socket.io-client";
import {Modal, Carousel}	from "bootstrap";
const socket = io();

const cmon = new CookieMonster(() => document);

const QUIZ_AUTH_TOKEN = cmon.getCookie("quiztoken");
alert(QUIZ_AUTH_TOKEN);
//EJS.test;