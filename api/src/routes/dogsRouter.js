const { Router } = require('express');
const { getDogsHandler, getDogDetailHandler, addDogHandler } = require('../handlers/dogsHandlers.js')
const dogsRouter = Router();

dogsRouter.get("/", getDogsHandler);
dogsRouter.get("/:idRaza", getDogDetailHandler);
dogsRouter.post("/", addDogHandler);

module.exports = dogsRouter;