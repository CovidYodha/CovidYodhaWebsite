const fs = require('fs')
const raw_data1 = require('../tmp/raw_data1.json')
const raw_data2 = require('../tmp/raw_data2.json')
const deaths_recoveries1 = require('../tmp/deaths_recoveries1.json')
const deaths_recoveries2 = require('../tmp/deaths_recoveries2.json')

raw_data2.raw_data = raw_data1.raw_data.concat(raw_data2.raw_data)
deaths_recoveries2.deaths_recoveries = deaths_recoveries1.deaths_recoveries.concat(deaths_recoveries2.deaths_recoveries)

// raw_array = raw_array.filter(item => !item.detectedstate);

fs.writeFileSync('./tmp/raw_data.json', JSON.stringify(raw_data2, null, 2))
fs.writeFileSync('./tmp/deaths_recoveries.json', JSON.stringify(deaths_recoveries2, null, 2))
© 2021 GitHub, Inc.
