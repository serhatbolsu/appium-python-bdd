# -*- coding: utf-8 -*-
u"""
Copyright 2015 Telefónica Investigación y Desarrollo, S.A.U.
This file is part of Toolium.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

from toolium.pageobjects.page_object import PageObject
from selenium.common.exceptions import NoSuchElementException

from toolium.pageelements import *
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.select import Select
import selenium.webdriver.support.expected_conditions as WAITCON
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import WebDriverException
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from toolium.pageelements import InputText, Button

import random
import string
import time

from selenium.webdriver.common.by import By


class TabsPageObject(PageObject):

    def init_page_elements(self):
	    tab_xpath = '(//android.widget.TabWidget//android.widget.TextView)[{}]'
	    tab1 = Button(By.XPATH, tab_xpath.format('1'))
	    tab2 = Button(By.XPATH, tab_xpath.format('2'))
	    tab3 = Button(By.XPATH, tab_xpath.format('3'))
	    content1 = Text(By.ID, 'io.appium.android.apis:id/view1')
	    content2 = Text(By.ID, 'io.appium.android.apis:id/view2')
	    content3 = Text(By.ID, 'io.appium.android.apis:id/view3')
	    container = PageElement(By.ID, 'android:id/content')

    def startAlarm(self):
		self.driver.find_element_by_xpath('//*[@text="Start Alarm Service"]').click()
		time.sleep(5)

    def stopAlarm(self):
		self.driver.find_element_by_xpath('//*[@text="Stop Alarm Service"]').click()
		time.sleep(3)
 		self.driver.back()
		time.sleep(3)
 		self.driver.back()
		time.sleep(3)
 		self.driver.back()
