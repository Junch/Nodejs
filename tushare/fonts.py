# import matplotlib.pyplot as plt
# from matplotlib.font_manager import FontManager
# from pylab import mpl
# import subprocess

# def get_matplot_zh_font():
#     fm = FontManager()
#     mat_fonts = set(f.name for f in fm.ttflist)

#     output = subprocess.check_output('fc-list :lang=zh -f "%{family}\n"', shell=True)
#     ss = str(output, encoding = "utf-8")
#     print(ss)
#     zh_fonts = set(f.split(',', 1)[0] for f in ss.split('\n'))
#     available = list(mat_fonts & zh_fonts)

#     print ('*' * 10, '可用的字体', '*' * 10)
#     for f in available:
#         print (f)
#     return available

# def set_matplot_zh_font():
#     available = get_matplot_zh_font()
#     if len(available) > 0:
#         mpl.rcParams['font.sans-serif'] = [available[0]]    # 指定默认字体
#         mpl.rcParams['axes.unicode_minus'] = False          # 解决保存图像是负号'-'显示为方块的问题

# set_matplot_zh_font()
# plt.plot([1,2,3])
# plt.title("汉字")
# plt.show()

# -*- coding:utf-8 -*-
import matplotlib
from matplotlib.font_manager import FontManager, FontProperties
import matplotlib.pyplot as plot
 
def getChineseFont():
    return FontProperties(fname='/System/Library/Fonts/PingFang.ttc', size=12)
 
if __name__ == '__main__':
    plot.plot([1,2,3])
    font = getChineseFont()
    plot.title("天王盖地虎", fontproperties=font)
    plot.show()