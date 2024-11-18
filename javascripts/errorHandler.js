const errorHandler = (error, request, response, next) => {
  console.log('Hey!!! Hello! This is the error message!!!!!!!!', error.message)
  console.log('Error name', error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = errorHandler