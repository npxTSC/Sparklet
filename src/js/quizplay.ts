// Actual quiz code (live game)
"use strict";

import {filterStringE,	cmon,
	   shakeElement}		from "../../util";
import {io}					from "socket.io-client";
import {Modal, Carousel}	from "bootstrap";
const socket = io();

const QUIZ_AUTH_TOKEN = cmon.read(document.cookie, "quiztoken");
//EJS.test;