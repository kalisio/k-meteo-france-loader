const createJob = require('./job-arpege')

// Setup job name, model name, bounds and generation parameters
module.exports = createJob({
  id: 'arpege-europe',
  model: 'ARPEGE',
  grid: 0.1,
  runTimes: ['00:00:00', '06:00:00', '12:00:00', '18:00:00'],
  packages: ['SP1'], // ['HP1', 'HP2', 'IP1', 'IP2', 'IP3', 'IP4', 'SP1', 'SP2']
  forecastTimes: ['00H12H', '13H24H', '25H36H', '37H48H', '49H60H', '61H72H', '73H84H', '73H84H', '85H96H', '97H102H', '103H114H']
})
