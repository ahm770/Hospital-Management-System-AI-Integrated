// src/services/socket/socket.ts
import { BASE_URL } from '@/constants/constants';
import { io } from 'socket.io-client';
import logger from "@/utils/logger"

const URL = BASE_URL;

let socket;

export const getSocket = () => {
    if (!socket) {
        socket = io(URL, {
            autoConnect: true,
            auth: (cb) => {
                try {
                    if (typeof window !== 'undefined') {
                        // Attempt to get token from localStorage on the client-side
                        const token = localStorage.getItem('token'); // Or however you store your token

                        if (token) {
                            console.log("socket token::", token)
                           cb({ token: token });
                        }
                        else {
                              cb({ token: null });  // send null if it fails.
                        }

                    } else {
                        // Provide a default or empty token on the server side
                        cb({ token: null });
                    }

                } catch (error) {
                    logger.error(error)
                    cb({ token: null });
                }
            },
        });
    }
    return socket;
};