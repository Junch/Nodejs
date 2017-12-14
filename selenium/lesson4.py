import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from decimal import *

# https://www.w3schools.com/jsref/met_document_getelementsbyclassname.asp
# https://developers.google.com/web/updates/2017/04/headless-chrome

class PythonOrgSearch(unittest.TestCase):

    def setUp(self):
        chrome_options = Options()  
        chrome_options.add_argument("--headless") 
        chrome_options.add_argument("--disable-gpu")
        self.driver = webdriver.Chrome(chrome_options=chrome_options)

    def test_search_in_python_org(self):
        driver = self.driver
        driver.get("http://www.sse.com.cn/services/hkexsc/currency/")
        time.sleep(1)
        driver.execute_script("var setDate=document.getElementsByClassName('sse_conyear_date')[1].children[0];setDate.removeAttribute('readonly');")
        dateElement = driver.find_elements(By.XPATH, '//input[@id="start_date2"]')[1]
        dateElement.clear()
        dateElement.send_keys("2017-12-12")
        driver.find_elements_by_xpath("//button[@id='btnQuery']")[1].click()
        time.sleep(1)
        #sellRatio = driver.find_element_by_xpath('//table[@class="table_search_table2"]/tbody/tr[2]/td[2]/div').text
        buyRatio = driver.find_element_by_xpath('//*[@id="tableData_"]/div[2]/table/tbody/tr[2]/td[2]/div').text
        sellRatio = driver.find_element_by_xpath('//*[@id="tableData_"]/div[2]/table/tbody/tr[2]/td[3]/div').text
        average = (Decimal(buyRatio) + Decimal(sellRatio))/2
        print average

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()