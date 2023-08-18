const { getAllDogsController, getDogsByQuery, getDogDetailController, addDogController } = require('../controllers/dogsControllers')

const getDogsHandler = async (req, res) => {
  const { name } = req.query;
  if(name){
    try {
      const dogs = await getDogsByQuery(name);
      if (dogs.length > 0) {
        res.status(200).json(dogs);
      } else {
        res.status(404).json({ message: 'No se encontraron perros con ese nombre.' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    try {
      const response = await getAllDogsController();
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

const getDogDetailHandler = async (req, res) => {
  const { idRaza } = req.params;
  try {
    const response = await getDogDetailController(idRaza);

    if (response === null) {
      res.status(404).json({ error: 'Perro no encontrado' });
    } else {
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const addDogHandler = async (req, res) => {
  const { name, image, height, weight, life_span, temperaments } = req.body
  try {
    const response = await addDogController(name, image, height, weight, life_span, temperaments);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
    getDogsHandler,
    getDogDetailHandler,
    addDogHandler
}