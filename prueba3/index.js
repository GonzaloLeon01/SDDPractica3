import http from "http";
import { getAllGames } from "./games.controller.js";
import { v4 as uuidv4 } from "uuid";
import { getGames, writeGames } from "./games.repositories.js";

const HTTP_PORT = 3000;

//enviar por mail: casasmartinignacio gmaiil.com
const server = http.createServer((req, res) => {
  if (req.url.startsWith("/games/")) {
    if (req.method === "GET") {
      getAllGames(req, res);
    } else if (req.method === "POST") {
      try {
        // addGame(req, res)
        let body = "";
        req.on("data", (chunk) => {
          body = body + chunk;
        });
        req.on("end", () => {
          const parsedBody = JSON.parse(body);
          if (!parsedBody.name || !parsedBody.description) {
            res.writeHead(400, "Invalid request!!!!!");
            res.end();
            return;
          }
          const newDocument = {
            uid: uuidv4(),
            name: parsedBody.name,
            description: parsedBody.description,
          };
          const existingGames = getGames();
          existingGames.push(newDocument);
          writeGames(existingGames);
          res.end();
        });
      } catch (e) {
        console.log("Error", e);
        res.writeHead(500, "Error");
        res.end();
      }
    } else if (req.method === "DELETE") {
      let id = req.url.slice(7);
      let existingGames = getGames();
      // usar metodo findID buscar por ID, y si no existe tirar error 404
      if (existingGames.find((objeto) => objeto.uid === id)) {
        //si existe
        existingGames = existingGames.filter((objecto) => objecto.uid !== id);
        console.log(existingGames);
        writeGames(existingGames);
      } else {
        res.writeHead(404, "Game not found");
      }

      res.end();
    } else {
      res.writeHead(404, "Ruta no encontrada");
      res.end();
    }
  } else {
    console.log(res.url);
    res.writeHead(404, "Ruta no encontrada");
    res.end();
  }
});

server.listen(HTTP_PORT, () => {
  console.log(`Servidor escuchando en puerto ${HTTP_PORT}`);
});

/* 

Hacer un delete /games/id, borrar el id del archivo y si no anda tirar el 404.
*/
