const errorHandler = (error, request, response, next) => {
  console.log('Hey!!! Hello! This is the error message!!!!!!!!', error.message);
  console.log('Error name', error.name);

  if (error.name = "CastError") {
    return response.status(400).send({error: 'Malformed id'});
  }

  next(error);
}

module.exports = errorHandler;