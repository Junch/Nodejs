# -*- coding: utf-8 -*-
import tushare as ts
import pandas as pd
import numpy as np
import numpy as np
import matplotlib.pyplot as plt
plt.rcParams['font.sans-serif']=['SimHei'] #用来正常显示中文标签
plt.rcParams['axes.unicode_minus']=False   #用来正常显示负号
#有中文出现的情况，需要u'内容'

def write_profit():
    frames = []
    arr = [(x, y) for x in range(2007, 2018) for y in range (1, 5)]
    arr.remove((2017, 4))

    for item in arr:
        df = ts.get_profit_data(item[0], item[1])
        df.set_index('code', inplace=True)
        frames.append(df)

    quaters = ['{}-{}'.format(x,y) for (x, y) in arr]
    result = pd.concat(frames, keys=quaters)
    result.index.names=[u'quarter', u'code']
    result.to_csv('profit.csv', encoding='utf-8')

def compare_item(df, column, stocks, title):
    ss = []
    labels = []
    for stock in stocks:
        dfstock = df.loc[(df.index.get_level_values('code') == stock) &
                         (df.index.get_level_values('quarter').str.endswith('4'))]
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
                label=unicode(labels[idx], 'utf-8'))

    plt.legend(prop={'family':'SimHei','size':15})
    plt.ylabel(column)
    plt.title(title)
    plt.xticks(index + (stocknum-1)*bar_width/2.0, ss[0].index.get_level_values('quarter'))
    plt.legend()
    plt.grid(linestyle='dotted')
    plt.tight_layout()
    plt.show()

def read_profit():
    df = pd.read_csv('profit.csv', dtype={'code' : np.str})
    df.set_index(['quarter', 'code'], inplace=True)
    df.sort_index()

    compare_item(df, 'net_profits', ['000651', '000333', '600690', '002415'], u'净利润比较')
    #compare_item(df, 'net_profits', ['000651', '000333'], u'净利润比较')
    #compare_item(df, 'net_profits', ['000651'], u'净利润比较')

if __name__=="__main__":
    #write_profit()
    read_profit()
