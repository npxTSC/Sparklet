import { Socket }			from "socket.io";
import { v4 as newUUID }	from "uuid";

import { findRoom, generateToken }					from "./app";
import { AccountPublic, QuizHostCmdFn, QuizPlayer }	from "./classes";
import { QP_NAME_LIMIT }							from "./consts";

export const HOST_CMDS: Record<string, QuizHostCmdFn> = {
	getPlayers:	(args, room) => {
		return {
			players: room!.players
		}
	},

	ban:		(args, room) => {
		const userToBan = room!.players.find((v) => v.uuid === args[0]);
		
		if (!userToBan) return {
			alert: `Could not find user!`
		}

		const name = userToBan.username;
		room!.players = room!.players.filter((v) => v.uuid !== args[0]);
		
		return {
			alert: `Banned player "${name}"`
		}
	},
	
	echo:		(args) => {
		return {
			alert: args[0]
		}
	}
}

export const QUIZ_SOCKET_HANDLERS = {
	joinRoom: function(socket: Socket) {
		return (data: {
			username:	string;
			account:	AccountPublic
			roomcode:	string;
		}) => {
			// If quiz invalid
			const room = findRoom(data.roomcode);
			const username = data.username.trim().substring(0, QP_NAME_LIMIT);
			
			if (!room || username.length === 0) {
				console.log("Attempt to join finished quiz :P");
				return socket.emit("quizNotFound on step 2");
			}
			
			// Add user to quiz
			console.log(`User ${username} joined code ${data.roomcode}`);

			const ply: QuizPlayer = {
				username,
				uuid:			newUUID(),
				account:		data.account,
				correctQs:		0,

				// Less secure token, due to less motivation to hack it
				tempToken:		generateToken(96)
			}

			room.players.push(ply);
			
			socket.emit("joinRoomSuccess", {
				quizToken: ply.tempToken,
			});
		}
	}
}
