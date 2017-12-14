import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

class PythonOrgSearch(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_search_in_python_org(self):
        driver = self.driver
        driver.get("http://www.sse.com.cn/market/stockdata/overview/day/")
        time.sleep(1)
        driver.execute_script("var setDate=document.getElementById('start_date2');setDate.removeAttribute('readonly');")
        setDateElement=driver.find_element_by_xpath("//input[@id='start_date2']")
        setDateElement.clear()
        setDateElement.send_keys("2017-12-12")
        driver.find_element_by_id("btnQuery").click()
        time.sleep(1)
        # circulation market value
        negotiableValueA_sh=driver.find_element_by_xpath('//*[@id="tableData_934"]/div[2]/table/tbody/tr[3]/td[3]/div').text
        # turnover
        trdAmtA_sh=driver.find_element_by_xpath('//*[@id="tableData_934"]/div[2]/table/tbody/tr[5]/td[3]/div').text
        # Price-to-Earning Ratio
        profitRateA_sh=driver.find_element_by_xpath('//*[@id="tableData_934"]/div[2]/table/tbody/tr[7]/td[3]/div').text
        print negotiableValueA_sh, trdAmtA_sh, profitRateA_sh

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()