import tushare as ts
import pandas as pd
import numpy as np

def write_profit():
    frames = []
    arr = [(2017,3), (2017,2), (2017,1), (2016,4), (2016,3)]
    for item in arr:
        df = ts.get_profit_data(item[0], item[1])
        df.set_index('code', inplace=True)
        frames.append(df)

    quaters = ['{}-{}'.format(x,y) for (x, y) in arr]
    result = pd.concat(frames, keys=quaters)
    result.to_csv('profit.csv', encoding='utf-8')

def read_profit():
    df = pd.read_csv('profit.csv', dtype={'code' : np.str})
    print(df.columns)
    tmp = df[df.code == u'601318']
    print(tmp.to_string())

write_profit()
read_profit()
