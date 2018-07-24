# -*- coding:utf-8 -*-
import numpy as np
import matplotlib.pyplot as plt
import matplotlib
#如果修改了配置文件matplotlibrc，下面两行就不必要了
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

if __name__ == '__main__':
    plt.plot([-1,0,1,2,3])
    plt.title("天王盖地虎")
    plt.show()

#下面这个字体是系统自带，可以直接使用，只是不大好看
#plt.rcParams['font.sans-serif'] = ['Arial Unicode MS']

#下面这个ttc字体，需要修改font_manager.py文件后才可以使用
# [Matplotlib在Mac上的中文支持問題](https://hk.saowen.com/a/06222ed0deba30ecdec18e14f4c9bc66cf12ac242355a50cadc0391324114f3d)
#plt.rcParams['font.sans-serif'] = ['Hiragino Sans GB']