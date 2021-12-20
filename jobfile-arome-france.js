const createJob = require('./job-arome')

// Setup job name, model name, bounds and generation parameters
module.exports = createJob({
  id: 'arome-france-loader',
  model: 'AROME',
  grid: 0.025,
  runTimes: ['06:00:00'],
  packages: ['SP1'],
  forecastTimes: ['00H06H']
})
