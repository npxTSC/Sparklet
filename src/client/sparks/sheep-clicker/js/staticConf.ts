import Decimal	from "./_decimal";
import {qstr}	from "./dx";

export enum $Unit {
	SHEPHERD,
	SHEARER,
	KNITTER,
	BABYSITTER,
	PIZZAGUY,
}

export const FPS		= 20;
export const FPS_DELAY	= 1000 / FPS;
export const dev		= qstr.parseQ()["dev"] === "1";
