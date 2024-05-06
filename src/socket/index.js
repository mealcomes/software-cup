import io from 'socket.io-client'
import {reactive, toRefs} from "vue";

export const socket = io('http://localhost:3000')

export const state = {
    username: '',
    status: false,
    isEdit: false
}

socket.on('connect_error', (error) => {
    console.log(error);
})

socket.on('connect', () => {
    console.log('Connected to server...')
    state.username = socket.id
    state.status = true
    socket.emit('join', JSON.stringify(state))
    console.log(JSON.parse(JSON.stringify(state)))
})
