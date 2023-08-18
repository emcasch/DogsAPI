require('dotenv').config();
const { Dog, Temperament } = require('../db');
const axios = require('axios');
const { API_KEY } = process.env;
const { Op } = require('sequelize'); //para poder usar el operador "iLike", para poder buscar en la DB perros por nombre no exacto


const getAllDogsController = async () => {
    // Obtener perros de la base de datos
    const dbDogs = await Dog.findAll();

    // Obtener videojuegos de la API externa
    const apiResponse = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`);
    const apiDogs = apiResponse.data;

    // Combinar videojuegos de la base de datos y de la API
    const dogs = [...dbDogs, ...apiDogs];

    return dogs;
};

const getDogsByQuery = async (name) => {
  // Buscar perros en la base de datos
  const dbDogs = await Dog.findAll({
    where: {
      name: {
        [Op.iLike]: `%${name}%`,
      },
    },
  });

  // Buscar perros en la API externa
  const apiResponse = await axios.get(`https://api.thedogapi.com/v1/breeds/search?q=${name}&api_key=${API_KEY}`);
  const apiDogs = apiResponse.data;

  // Combinar resultados de la base de datos y de la API
  const dogs = [...dbDogs, ...apiDogs];
  return dogs;
};

const getDogDetailController = async (idRaza) => {
  // Obtener perro de la base de datos por searchID
  const dbDog = await Dog.findOne({
    where: { searchID: idRaza },
    include: {
      model: Temperament,
      attributes: ['name'],
      through: { attributes: [] },
    },
  });

  if (dbDog) {
    const temperaments = dbDog.Temperaments.map(temperament => temperament.name);
    return { ...dbDog.toJSON(), Temperaments: temperaments };
  } else {
    const apiResponse = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`);
    const apiDogs = apiResponse.data;
    const dogFromAPI = apiDogs.find(obj => String(obj.id) === String(idRaza));

    if (dogFromAPI) {
      const dogData = {
        name: dogFromAPI.name,
        image: dogFromAPI.image.url,
        height: `${dogFromAPI.height.metric} cm`,
        weight: `${dogFromAPI.weight.metric} kg`,
        life_span: dogFromAPI.life_span,
      };

      if (dogFromAPI.temperament) {
        const temperaments = dogFromAPI.temperament.split(", ");
        dogData.Temperaments = temperaments;
      }

      return dogData;
    } else {
      return null;
    }
  }
};

const addDogController = async(name, image, height, weight, life_span, temperaments) => {
  // Buscar los temperamentos por nombre
  const foundTemperaments = await Temperament.findAll({
    where: {
      name: temperaments
    }
  });

  // Crear el perro en la base de datos
  const dbDog = await Dog.create({
    name,
    image,
    height,
    weight,
    life_span,
  });

  // Asociar los géneros encontrados al videojuego
  await dbDog.setTemperaments(foundTemperaments);

  return dbDog;
}

module.exports = {
    getAllDogsController,
    getDogsByQuery,
    getDogDetailController,
    addDogController
}