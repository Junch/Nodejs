#!/usr/bin/python
# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import pymongo
from pymongo import MongoClient
import datetime
import json

# https://www.joinquant.com/post/8104?subLive=1
# http://ec2-54-218-106-48.us-west-2.compute.amazonaws.com/moschetti.org/rants/mongopandas.html

def write_db(db_name, coll_name):
    df = pd.read_csv('profit_sample.csv', dtype={'code' : np.str}, parse_dates=['quarter'])
    df_clean = df.drop_duplicates(subset=['quarter', 'code'])
    data = df_clean.to_dict(orient='records')
    client = MongoClient('mongodb://localhost:27017/')
    coll = client[db_name][coll_name]
    coll.drop()
    coll.create_index([("quarter", pymongo.ASCENDING), ("code", pymongo.ASCENDING)], unique=True)
    coll.insert_many(data)
    client.close()

def read_db(db_name, coll_name):
    client = MongoClient('mongodb://localhost:27017/')
    coll = client[db_name][coll_name]
    df = pd.DataFrame(list(coll.find()))
    df.quarter = df.quarter.dt.to_period("Q")
    print(df.head().to_string())
    client.close()

db_name='stockdb'
coll_name='profit'
write_db(db_name, coll_name)
read_db(db_name, coll_name)
