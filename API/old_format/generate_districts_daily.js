console.log('generate_district_daily start')
const fs = require('fs')

const testFolder = './tmp/districts_daily/'

files = fs.readdirSync(testFolder)

data = { districtsDaily: {} }
files.forEach(file => {
  if (!file.startsWith('202')) { return }

  var jsonData = JSON.parse(fs.readFileSync(testFolder + file + '/state_district_wise.json', 'utf8'))
  for (state in jsonData) {
    if (!data.districtsDaily[state]) {
      data.districtsDaily[state] = {}
    }
    for (district in jsonData[state].districtData) {
      if (!data.districtsDaily[state][district]) {
        data.districtsDaily[state][district] = []
      }
      dist = jsonData[state].districtData[district]
      delete dist.delta
      dist.date = file
      data.districtsDaily[state][district].push(dist)
    }
  }
})

fs.writeFileSync('./tmp/districts_daily.json', JSON.stringify(data, null, 2))
console.log('generate_district_daily end')
