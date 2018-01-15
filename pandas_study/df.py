#!/usr/bin/python
# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np

d = {
    'Name': pd.Series(['Tom', 'James', '小波', '小明']),
    'Age': pd.Series([21, 22, 23, 20]),
    'Rating': pd.Series([4.23, 3.24, 3.98, 2.56])
}

df = pd.DataFrame(d)
print df

a = df.to_json(force_ascii=False)
print a