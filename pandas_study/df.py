#!/usr/bin/python
# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import pymongo
from pymongo import MongoClient
import datetime
import json
from datetime import datetime

# https://www.joinquant.com/post/8104?subLive=1
# http://ec2-54-218-106-48.us-west-2.compute.amazonaws.com/moschetti.org/rants/mongopandas.html

class DataWorker(object):
    def __init__(self, db_name, coll_name, code_name, date_name):
        self.db_name = db_name
        self.coll_name = coll_name
        self.code_name = code_name
        self.date_name = date_name
    
    def write(self, csv_name):
        df = pd.read_csv(csv_name, dtype={self.code_name: np.str}, parse_dates=[self.date_name])
        df_clean = df.drop_duplicates(subset=[self.date_name, self.code_name])
        data = df_clean.to_dict(orient='records')
        client = MongoClient('mongodb://localhost:27017/')
        coll = client[self.db_name][self.coll_name]
        coll.drop()
        coll.create_index([(self.date_name, pymongo.ASCENDING), (self.code_name, pymongo.ASCENDING)], unique=True)
        coll.insert_many(data)
        client.close()

    def read(self, query):
        client = MongoClient('mongodb://localhost:27017/')
        coll = client[self.db_name][self.coll_name]
        df = pd.DataFrame(list(coll.find(query, {'_id': False})))
        df[self.date_name] = df.quarter.dt.to_period("Q")
        return df

def write_tushare():
    db_name = 'stockdb'
    coll_name = 'profit'
    code_name = 'code'
    date_name = 'quarter'
    worker = DataWorker(db_name, coll_name, code_name, date_name)
    worker.write('profit.csv')
    query = {}
    df = worker.read(query)
    print(df.head().to_string())

def write_xueqiu():
    db_name = 'stockdb'
    coll_name = 'xueqiu'
    code_name = 'symbol'
    date_name = 'reportdate'
    worker = DataWorker(db_name, coll_name, code_name, date_name)
    worker.write('xueqiu.csv')
    query = {}
    df = worker.read(query)
    print(df.head().to_string())

def test():
    db_name = 'stockdb'
    coll_name = 'profit_sample'
    code_name = 'code'
    date_name = 'quarter'
    worker = DataWorker(db_name, coll_name, code_name, date_name)
    worker.write('profit_sample.csv')
    df = worker.read({})
    print(df.head().to_string())

if __name__ == "__main__":
    test()
    #write_xueqiu()
    #write_tushare()
