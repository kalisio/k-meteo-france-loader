import createJob from './job-arpege.js'

// Setup job name, model name, bounds and generation parameters
export default createJob({
  id: 'arpege-world',
  model: 'ARPEGE',
  grid: 0.5,
  runTimes: ['00:00:00', '06:00:00', '12:00:00', '18:00:00'],
  packages: ['SP1'], // ['HP1', 'HP2', 'IP1', 'IP2', 'IP3', 'IP4', 'SP1', 'SP2']
  forecastTimes: ['00H24H', '27H48H', '51H72H', '75H102H', '105H114H']
})
