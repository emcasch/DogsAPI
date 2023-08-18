require('dotenv').config();
const { Temperament } = require('../db');
const axios = require('axios');
const { API_KEY } = process.env;

const getTemperamentsController = async () => {
    // Obtener temperamentos de la base de datos
    const dbTemperaments = await Temperament.findAll();

    if (dbTemperaments.length > 0) {
      return dbTemperaments;
    } else {
      // Obtener temperamentos de la API externa
      const response = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`);
      const apiDogs = response.data
      const temperamentsSet = new Set(); //aqui guardaremos los temperaments, utilizaremos un set para que no haya duplicados
      apiDogs.forEach(dog => {
        if (dog.temperament) {
          const temperamentWords = dog.temperament.split(", ");
          temperamentWords.forEach(word => temperamentsSet.add(word));
        }
      });

      const temperamentsArray = Array.from(temperamentsSet); //convertimos el set a un array para trabajarlo más fácilmente

      // Guardar los géneros en la base de datos
      const createdTemperaments = await Promise.all(temperamentsArray.map(async (temperament) => {
        if (temperament) {
          const newTemperament = await Temperament.create({ name: temperament });
          console.log(`Temperament '${newTemperament.name}' creado.`);
          return newTemperament;
        }
      }));
  
      const filteredTemperaments = createdTemperaments.filter(Boolean);
      return filteredTemperaments;
    }
};

module.exports = {
    getTemperamentsController
}