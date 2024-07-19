// Module for providing classes/types to app.ts
"use strict";

// crab noises
export type Option<T> = T | null;

export interface Conductor {
    username: string;
    id: number;
}

export interface Room {
    joinHash: string;
    ownerAccId: string;
    authToken: string;
    quizId: string;
    currentQ: number;
    status: string;
    players: QuizPlayer[];
}

export interface QuizPlayer {
    username: string;
    uuid: string;
    correctQs: number;
    tempToken: string;
    account?: any;
}

export interface QuizHostCommand {
    room: string;
    auth: string;
    cmd: string;
}

export interface QuizHostResponse {
    players?: QuizPlayer[];
    alert?: string;
}

export type QuizHostCmdFn = (args: string[], room?: Room) => QuizHostResponse;

export enum AdminRank {
    Conductor,
    Helper,
    Electrician,
    Manager,
    Operator,
}
