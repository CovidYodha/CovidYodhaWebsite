import pandas as pd # pylint: disable=import-error
import re
from pathlib import Path
import logging
import sys
import os
from urllib.error import HTTPError
# Set logging level
logging.basicConfig(stream=sys.stdout,
                    format="%(message)s",
                    level=logging.INFO)

def fetch_raw_data_from_api():
    '''
    Read all raw data and death and recovery files
    Pass the latest version of raw data
    '''
    i = 1
    raw_d = []
    while True:
        try:
            url = f"https://api.covid19india.org/csv/latest/raw_data{i}.csv"
            df = pd.read_csv(url)
            df.to_csv(f'./tmp/csv/latest/raw_data{i}.csv',index=False)
            raw_d.append(df)
            logging.info(f"Fetched raw_data{i} ")
            i = i+1
        except HTTPError:
            current_ver = i-1
            break
 death_rec = []
    logging.info(f"Fetching deaths_and_recoveries")
    url = f"https://api.covid19india.org/csv/latest/death_and_recovered"
    df = pd.read_csv(f"{url}1.csv")
    death_rec.append(df)
    df.to_csv('./tmp/csv/latest/death_and_recovered1.csv',index=False)
    df = pd.read_csv(f"{url}2.csv")
    death_rec.append(df)
    df.to_csv('./tmp/csv/latest/death_and_recovered2.csv',index=False)
    
    return raw_d,death_rec,current_ver

def fetch_raw_data():
    '''
    Read all raw data and death and recovery files
    Return the latest number of raw data files
    '''
    raw_d = []
    death_rec = []
    fpath = Path('tmp/csv/latest')
    
    i = 1
    while True:
        try:
            df = pd.read_csv(fpath / f"raw_data{i}.csv")
            raw_d.append(df)
            logging.info(f"Fetched raw_data{i} ")
            i = i+1
        except FileNotFoundError:
            current_ver = i-1
            break
    
    i = 1
    while True:
        try:
            df = pd.read_csv(fpath / f"death_and_recovered{i}.csv")
            death_rec.append(df)
            logging.info(f"Fetched death_and_recovered{i} ")
            i = i+1
        except FileNotFoundError:
            break

    logging.info(f"Data read complete")

    return raw_d,death_rec,current_ver
