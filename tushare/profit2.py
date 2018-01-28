# -*- coding: utf-8 -*-
import tushare as ts
import pandas as pd
import numpy as np
import numpy as np
import matplotlib.pyplot as plt
import time
plt.rcParams['font.sans-serif']=['SimHei'] #用来正常显示中文标签
plt.rcParams['axes.unicode_minus']=False   #用来正常显示负号

g_start = 0

def write_profit():
    arr = [(x, y) for x in range(2007, 2018) for y in range (1, 5)]
    arr.remove((2017, 4))

    frames = []
    for item in arr:
        df = ts.get_profit_data(item[0], item[1])
        df.set_index('code', inplace=True)
        frames.append(df)

    quaters = [pd.Period('{}Q{}'.format(x,y)) for (x, y) in arr]
    result = pd.concat(frames, keys=quaters)
    result.index.names=[u'quarter', u'code']
    result.to_csv('profit.csv', encoding='utf-8')

def compare_item(df, periods, column, stocks, title):
    ss = []
    labels = []
    for stock in stocks:
        df1 = df.loc[df.code == stock]
        df1.set_index('quarter', inplace=True)

        c = (df1.index <= periods['end']) & (df1.index >= periods['start'])
        if (periods['year']):
            c = c & (df1.index.quarter == 4)
        dfstock = df1.loc[c]
        ss.append(dfstock[column])
        labels.append(dfstock.name[0])

    # create plot
    fig, ax = plt.subplots(figsize=(8,6))
    stocknum = len(ss)
    groupnum = len(ss[0])
    index = np.arange(groupnum)
    bar_width = 1.0/(stocknum+1)
    opacity = 0.8
    
    for idx, s in enumerate(ss):
        plt.bar(index + idx*bar_width, s, bar_width,
                alpha=opacity,
                label=labels[idx])

    plt.legend(prop={'family':'SimHei','size':15})
    plt.ylabel(column)
    plt.title(title)
    plt.xticks(index + (stocknum-1)*bar_width/2.0, ss[0].index.get_level_values('quarter'))
    plt.legend()
    plt.grid(linestyle='dotted')
    plt.tight_layout()
    end = time.time()
    print(end - g_start)
    plt.show()

def read_profit():
    df = pd.read_csv('profit.csv', dtype={'code' : np.str}, parse_dates=['quarter'])
    df.quarter = df.quarter.dt.to_period("Q") #df.quarter = pd.DatetimeIndex(df.quarter).to_period('Q')
    #df.set_index(['quarter', 'code'], inplace=True) #speed will slow down dramatically
    #df.sort_index()
    periods = {'start':'2007Q1', 'end':'2017Q4', 'year': True}
    end = time.time()
    print(end - g_start)
    compare_item(df, periods,'net_profits', ['000651', '000333', '600690', '002415'], '净利润比较')

if __name__=="__main__":
    #write_profit()
    g_start = time.time()
    read_profit()
