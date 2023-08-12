// Module for providing classes/types to app.ts
"use strict";

import { RowDataPacket } from "mysql2/promise";

// iguana noises
export type Nullable<T> = T | null;

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
  account?: SparkletDB.SparkletUser;
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

export interface CapsuleContent {
  questions: Record<string, number>;
  answers: string[];
}

export enum AdminRank {
  Conductor,
  Helper,
  Electrician,
  Manager,
  Operator,
}

// unfortunately i do not implement this type irl
export type Dateable = {
  date: number;
  [key: string]: any;
};

export type TimestampIntoDate<Inner> = Omit<Inner, "date"> & { date: Date };

export type DateablePacket = RowDataPacket & Dateable;

export namespace SparkletDB {
  // Row stuff, except date goes from number -> Date
  export type SparkletUser = TimestampIntoDate<SparkletUserRow>;
  export type Capsule = TimestampIntoDate<CapsuleRow>;
  export type NewsPost = TimestampIntoDate<NewsPostRow>;
  export type Spark = TimestampIntoDate<SparkRow>;
  export type SparkDisp = Spark & { creatorName: string };

  export type SparkletUserPublic = Omit<
    SparkletUser,
    "passHash" | "emailVToken" | "authToken"
  >;

  /*
   * These types should only be used by code in db.ts!!!!
   */

  export type SparkletUserRow = DateablePacket & {
    uuid: string;
    name: string;
    passHash: string;
    date: number;
    adminRank: number;
    emailVerified: boolean;
    emailVToken?: string;
    authToken?: string;
    pfpSrc?: string;
    bio?: string;
  };

  export type CapsuleRow = DateablePacket & {
    uuid: string;
    name: string;
    creator: string;
    version: string;
    content: string;
    visible: boolean;
    date: number;
    likes: number;
  };

  export type NewsPostRow = DateablePacket & {
    uuid: string;
    title: string;
    author: string;
    content: string;
    visible: boolean;
    date: number;
  };

  export type SparkRow = DateablePacket & {
    uuid: string;
    title: string;
    creator: string;
    description: string;
    visible: boolean;
    date: number;
  };
}
