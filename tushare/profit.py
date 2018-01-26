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

def compare_item(s1, s2, label1, label2, title):
    n_groups = len(s1)
    
    # create plot
    fig, ax = plt.subplots(figsize=(12,6))
    index = np.arange(n_groups)
    bar_width = 0.36
    opacity = 0.8
    
    rects1 = plt.bar(index, s1, bar_width,
                    alpha=opacity,
                    color='b',
                    label=unicode(label1, 'utf-8'))

    rects2 = plt.bar(index + bar_width, s2, bar_width,
                    alpha=opacity,
                    color='g',
                    label=unicode(label2, 'utf-8'))

    plt.legend(prop={'family':'SimHei','size':15})
    plt.xlabel(u'时间')
    plt.ylabel(u'净利润')
    plt.title(title)
    plt.xticks(index+bar_width/2.0, s1.index.get_level_values('quarter'))
    plt.legend()
    plt.grid(linestyle='dotted')
    plt.tight_layout()
    plt.show()

def read_profit():
    df = pd.read_csv('profit.csv', dtype={'code' : np.str})
    df.set_index(['quarter', 'code'], inplace=True)
    df.sort_index()

    df651 = df.loc[ (df.index.get_level_values('code') == '000651') &
                    (df.index.get_level_values('quarter').str.endswith('4'))]
    df333 = df.loc[ (df.index.get_level_values('code') == '000333') &
                    (df.index.get_level_values('quarter').str.endswith('4'))]

    s541 = df651.net_profits
    s333 = df333.net_profits

    compare_item(s541, s333, df651.name[0], df333.name[0], u'净利润比较')

write_profit()
read_profit()
