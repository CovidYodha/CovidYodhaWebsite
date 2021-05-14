import csv
import logging
import json
import yaml 
from collections import defaultdict,OrderedDict
from datetime import datetime,timedelta
from pathlib import Path

logging.basicConfig(handlers=[logging.NullHandler()],
                    format='%(message)s',
                    level=logging.INFO)

# Current date in India
INDIA_DATE = datetime.strftime(
    datetime.utcnow() + timedelta(hours=5, minutes=30), '%Y-%m-%d')

INPUT_DIR = Path('tmp')
# Contains state codes to be used as API keys
META_DATA = INPUT_DIR / 'misc.json'
# Contains list of geographical districts
DISTRICT_LIST = INPUT_DIR / 'state_district_wise.json'
# All raw_data's
RAW_DATA = 'raw_data{n}.json'
# Contains deaths and recoveries for entries in raw_data1 and raw_data2
OUTCOME_DATA = 'deaths_recoveries{n}.json'
# Contains district data on 26th April
DISTRICT_DATA_GOSPEL = INPUT_DIR / 'csv' / 'latest' / 'districts_26apr_gospel.csv'
GOSPEL_DATE = '2020-04-26'
# India testing data
ICMR_TEST_DATA = INPUT_DIR / 'data.json'
# States testing data
STATE_TEST_DATA = INPUT_DIR / 'state_test_data.json'
# District testing data
DISTRICT_TEST_DATA = INPUT_DIR / 'csv' / 'latest' / 'district_testing.csv'
## For adding metadata
# For state notes and last updated
STATE_WISE = INPUT_DIR / 'data.json'
# For district notes
DISTRICT_WISE = INPUT_DIR / 'state_district_wise.json'

OUTPUT_DIR = Path('tmp', 'v3')
OUTPUT_MIN_DIR = OUTPUT_DIR / 'min'
OUTPUT_DATA_PREFIX = 'data'
OUTPUT_TIMESERIES_FILENAME = 'timeseries'

# Two digit state codes
STATE_CODES = {}
# State codes to state names map (capitalized appropriately)
STATE_NAMES = {}
# State/district populations
STATE_POPULATIONS = {}
DISTRICT_POPULATIONS = defaultdict(dict)
# Code corresponding to MoHFW's 'Unassigned States' in sheet
UNASSIGNED_STATE_CODE = 'UN'
# Dict containing geographical districts
DISTRICTS_DICT = defaultdict(dict)
# District key to give to unkown district values in raw_data
UNKNOWN_DISTRICT_KEY = 'Unknown'

PRIMARY_STATISTICS = ['confirmed', 'deceased', 'recovered']

RAW_DATA_MAP = {
    'hospitalized': 'confirmed',
    'deceased': 'deceased',
    'recovered': 'recovered',
    'migrated_other': 'migrated',
}

def parse_state_metadata(raw_data):
  for i, entry in enumerate(raw_data['state_meta_data']):
    # State name with sheet capitalization
    state_name = entry['stateut'].strip()
    # State code caps
    state_code = entry['abbreviation'].strip().upper()
    STATE_CODES[state_name.lower()] = state_code
    STATE_NAMES[state_code] = state_name
    # State population
    try:
      population = int(entry['population'].strip())
    except ValueError:
      if entry['population']:
        logging.warning('[L{}] [Bad population: {}] {}'.format(
            i + 2, entry['population'], state_code))
      continue
    STATE_POPULATIONS[state_code] = population


def parse_district_list(raw_data):
  for i, entry in enumerate(raw_data.values()):
    state = entry['statecode'].strip().upper()
    if state not in STATE_CODES.values():
      logging.warning('[L{}] Bad state: {}'.format(i + 2, entry['statecode']))
      continue
    if 'districtData' not in entry:
      continue

    for district in entry['districtData']:
      district = district.strip()
      DISTRICTS_DICT[state][district.lower()] = district


def parse_district(district, state):
  district = district.strip()
  expected = True
  if not district or district.lower() == 'unknown':
    district = UNKNOWN_DISTRICT_KEY
  elif district.lower() in DISTRICTS_DICT[state]:
    district = DISTRICTS_DICT[state][district.lower()]
  else:
    expected = False
  return district, expected


def parse_district_metadata(raw_data):
  for i, entry in enumerate(raw_data['district_meta_data']):
    # State code
    state = entry['statecode'].strip().upper()
    if state not in STATE_CODES.values():
      logging.warning('[L{}] Bad state: {}'.format(i + 2, state))
      continue
    # District name with sheet capitalization
    district, expected = parse_district(entry['district'], state)
    if not expected:
      logging.warning('[L{}] [{}] Unexpected district: {}'.format(
          i + 2, state, district))
    # District population
    try:
      population = int(entry['population'].strip())
    except ValueError:
      if entry['population']:
        logging.warning('[L{}] [Bad population: {}] {}: {}'.format(
            i + 2, entry['population'], state, district))
      continue
    DISTRICT_POPULATIONS[state][district] = population


def inc(ref, key, count):
  if not isinstance(ref[key], int):
    # Initialize with 0
    ref[key] = 0
  # Increment
  ref[key] += count


def parse(raw_data, i):
  for j, entry in enumerate(raw_data['raw_data']):
    state_name = entry['detectedstate'].strip().lower()
    try:
      state = STATE_CODES[state_name]
    except KeyError:
      # Entries with empty state names are discarded
      if state_name:
        # Unrecognized state entries are discarded and logged
        logging.warning('[L{}] [{}] [Bad state: {}] {}'.format(
            j + 2, entry['dateannounced'], entry['detectedstate'],
            entry['numcases']))
      continue

    try:
      fdate = datetime.strptime(entry['dateannounced'].strip(), '%d/%m/%Y')
      date = datetime.strftime(fdate, '%Y-%m-%d')
      if date > INDIA_DATE:
        # Entries from future dates will be ignored
        logging.warning('[L{}] [Future date: {}] {}: {} {}'.format(
            j + 2, entry['dateannounced'], entry['detectedstate'],
            entry['detecteddistrict'], entry['numcases']))
        continue
    except ValueError:
      # Bad date
      logging.warning('[L{}] [Bad date: {}] {}: {} {}'.format(
          j + 2, entry['dateannounced'], entry['detectedstate'],
          entry['detecteddistrict'], entry['numcases']))
      continue

    district, expected = parse_district(entry['detecteddistrict'], state)
    if not expected:
      # Print unexpected district names
      logging.warning('[L{}] [{}] [Unexpected district: {} ({})] {}'.format(
          j + 2, entry['dateannounced'], district, state, entry['numcases']))

    try:
      count = int(entry['numcases'].strip())
    except ValueError:
      logging.warning('[L{}] [{}] [Bad numcases: {}] {}: {}'.format(
          j + 2, entry['dateannounced'], entry['numcases'], state, district))
      continue

    if count:
      try:
        # All rows in v1 and v2 are confirmed cases
        statistic = 'confirmed' if i < 3 else RAW_DATA_MAP[
            entry['currentstatus'].strip().lower()]

        inc(data[date]['TT']['delta'], statistic, count)
        inc(data[date][state]['delta'], statistic, count)
        # Don't parse old district data since it's unreliable
        if i > 2 and date > GOSPEL_DATE and state != UNASSIGNED_STATE_CODE:
          inc(data[date][state]['districts'][district]['delta'], statistic,
              count)

      except KeyError:
        # Unrecognized status
        logging.warning('[L{}] [{}] [Bad currentstatus: {}] {}: {} {}'.format(
            j + 2, entry['dateannounced'], entry['currentstatus'], state,
            district, entry['numcases']))


def parse_outcome(outcome_data, i):
  for j, entry in enumerate(outcome_data['deaths_recoveries']):
    state_name = entry['state'].strip().lower()
    try:
      state = STATE_CODES[state_name]
    except KeyError:
      # Entries with empty state names are discarded
      if state_name:
        # Unrecognized state entries are discarded and logged
        logging.warning('[L{}] [{}] [Bad state: {}]'.format(
            j + 2, entry['date'], entry['state']))
      continue

    try:
      fdate = datetime.strptime(entry['date'].strip(), '%d/%m/%Y')
      date = datetime.strftime(fdate, '%Y-%m-%d')
      if date > INDIA_DATE:
        # Entries from future dates will be ignored
        logging.warning('[L{}] [Future date: {}] {}'.format(
            j + 2, entry['date'], state))
        continue
    except ValueError:
      # Bad date
      logging.warning('[L{}] [Bad date: {}] {}'.format(j + 2, entry['date'],
                                                       state))
      continue

    district, expected = parse_district(entry['district'], state)
    if not expected:
      # Print unexpected district names
      logging.warning('[L{}] [{}] [Unexpected district: {} ({})] {}'.format(
          j + 2, entry['date'], district, state, entry['numcases']))

    try:
      statistic = RAW_DATA_MAP[entry['patientstatus'].strip().lower()]

      inc(data[date]['TT']['delta'], statistic, 1)
      inc(data[date][state]['delta'], statistic, 1)
      ## Don't parse old district data since it's unreliable
      #  inc(data[date][state]['districts'][district]['delta'], statistic,
      #      1)
    except KeyError:
      # Unrecognized status
      logging.warning('[L{}] [{}] [Bad patientstatus: {}] {}: {}'.format(
          j + 2, entry['date'], entry['patientstatus'], state, district))


def parse_district_gospel(reader):
  for i, row in enumerate(reader):
    state = row['State_Code'].strip().upper()
    if state not in STATE_CODES.values():
      logging.warning('[{}] Bad state: {}'.format(i, state))
      continue
    district, expected = parse_district(row['District'], state)
    if not expected:
      # Print unexpected district names
      logging.warning('[{}] Unexpected district: {} {}'.format(
          i, state, district))

    for statistic in PRIMARY_STATISTICS:
      count = int(row[statistic.capitalize()] or 0)
      if count:
        data[GOSPEL_DATE][state]['districts'][district]['total'][
            statistic] = count


def parse_icmr(icmr_data):
  for j, entry in enumerate(icmr_data['tested']):
    count_str = entry['totalsamplestested'].strip()
    try:
      fdate = datetime.strptime(entry['testedasof'].strip(), '%d/%m/%Y')
      date = datetime.strftime(fdate, '%Y-%m-%d')
      if date > INDIA_DATE:
        # Entries from future dates will be ignored
        if count_str:
          # Log non-zero entries
          logging.warning('[L{}] [Future date: {}]'.format(
              j + 2, entry['testedasof']))
        continue
    except ValueError:
      # Bad timestamp
      logging.warning('[L{}] [Bad date: {}]'.format(j + 2,
                                                    entry['testedasof']))
      continue

    try:
      count = int(count_str)
    except ValueError:
      logging.warning('[L{}] [{}] [Bad totalsamplestested: {}]'.format(
          j + 2, entry['testedasof'], entry['totalsamplestested']))
      continue

    if count:
      data[date]['TT']['total']['tested'] = count
      data[date]['TT']['meta']['tested']['source'] = entry['source'].strip()
      data[date]['TT']['meta']['tested']['last_updated'] = date


def parse_state_test(raw_data):
  for j, entry in enumerate(raw_data['states_tested_data']):
    count_str = entry['totaltested'].strip()
    try:
      fdate = datetime.strptime(entry['updatedon'].strip(), '%d/%m/%Y')
      date = datetime.strftime(fdate, '%Y-%m-%d')
      if date > INDIA_DATE:
        # Entries from future dates will be ignored
        if count_str:
          # Log non-zero entries
          logging.warning('[L{}] [Future date: {}] {}'.format(
              j + 2, entry['updatedon'], entry['state']))
        continue
    except ValueError:
      # Bad date
      logging.warning('[L{}] [Bad date: {}] {}'.format(j + 2,
                                                       entry['updatedon'],
                                                       entry['state']))
      continue

    state_name = entry['state'].strip().lower()
    try:
      state = STATE_CODES[state_name]
    except KeyError:
      # Entries having unrecognized state names are discarded
      logging.warning('[L{}] [{}] [Bad state: {}]'.format(
          j + 2, entry['updatedon'], entry['state']))
      continue

    try:
      count = int(count_str)
    except ValueError:
      logging.warning('[L{}] [{}] [Bad totaltested: {}] {}'.format(
          j + 2, entry['updatedon'], entry['totaltested'], entry['state']))
      continue

    if count:
      data[date][state]['total']['tested'] = count
      data[date][state]['meta']['tested']['source'] = entry['source1'].strip()
      data[date][state]['meta']['tested']['last_updated'] = date

