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

d = {
    'Name': pd.Series(['Tom', 'James', '小波', '小明']),
    'Age': pd.Series([21, 22, 23, 20]),
    'Rating': pd.Series([4.23, 3.24, 3.98, 2.56])
}

df = pd.DataFrame(d)
print df

data = df.to_dict(orient='records')
print data

client = MongoClient('mongodb://localhost:27017/')
coll = client.test.person
coll.drop()
coll.insert_many(data)

df2 = pd.DataFrame(list(coll.find()))
print df2[['Name', 'Age', 'Rating']]