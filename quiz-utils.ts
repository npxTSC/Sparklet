import { Socket }			from "socket.io";
import { v4 as newUUID }	from "uuid";

import { QP_NAME_LIMIT }	from "./consts";
import {
	activeRooms, findRoom, generateToken
} from "./app";
import {
	AccountPublic, QuizHostCmdFn, QuizHostCommand, QuizPlayer
} from "./classes";

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

type SocketHandlerFactory = (socket: Socket) => ((...args: any[]) => void);

export const QUIZ_SOCKET_HANDLERS: Record<string, SocketHandlerFactory> = {
	quizHostAction: function(socket) {
		return (command: QuizHostCommand) => {
			socket.emit("quizHostResponse", runHostCommand(command));
		}
	},

	queryRoom: function(socket) {
		return (id: string) => {
			const room = findRoom(id);
			
			if (!room) {
				socket.emit("quizNotFound");
				console.log("Invalid quiz " + id);
			} else {
				socket.emit("quizFound");
				console.log("Successful quiz " + id);
			}
		}
	},

	joinRoom: function(socket) {
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

// For quiz hosts
function runHostCommand(cmdf: QuizHostCommand) {
	const {room, auth}	= cmdf;
	const echo = HOST_CMDS.echo;

	// Find room where owner's token matches
	const found = activeRooms.find(v => v.authToken === auth);
	if (!found) return echo(["???"]);
	
	const args = cmdf.cmd.split(":");
	const cmd = args.shift();

	if (!(cmd && HOST_CMDS[cmd])) return echo(["Invalid Command!"]);
	
	return HOST_CMDS[cmd](args, found);
}
