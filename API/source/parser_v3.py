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
