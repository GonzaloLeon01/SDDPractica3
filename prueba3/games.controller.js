import { getGames } from "./games.repositories.js";

export const getAllGames = (req, res) => {
    try {
        const result = getGames();
        res.setHeader('Content-Type', 'application/json')
        const response = {
            data: result
        }
        res.end(JSON.stringify(response));
    } catch (e) {
        console.log(e)
        res.writeHead(500)
        res.end('Error')
    }
}

export const addGame = (game) => {
    
}

