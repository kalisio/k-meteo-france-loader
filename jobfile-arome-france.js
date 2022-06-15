import createJob from './job-arome.js'

// Setup job name, model name, bounds and generation parameters
export default createJob({
  id: 'arome-france',
  model: 'AROME',
  grid: 0.025,
  runTimes: ['00:00:00', '03:00:00', '06:00:00', '09:00:00', '12:00:00', '15:00:00', '18:00:00'],
  packages: ['SP1'], // ['HP1', 'HP2', 'HP3', 'IP1', 'IP2', 'IP3', 'IP4', 'IP5', 'SP1', 'SP2', 'SP3']
  forecastTimes: ['00H06H', '07H12H', '13H18H', '19H24H', '25H30H', '31H36H', '37H42H']
})
