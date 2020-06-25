# -*- coding: utf-8 -*-

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
from android_behave.pageobjects.synchronization import Synchronization

import random
import string
import time

from selenium.webdriver.common.by import By


class TabsPageObject(PageObject):
	sync = Synchronization.get()

	def init_page_elements(self):
	    self.start = self.driver.find_element_by_xpath('//*[@text="Start Alarm Service"]')
	    tab_xpath = '(//android.widget.TabWidget//android.widget.TextView)[{}]'

	def startAlarm(self):
		try:

			self.logger.info("\n===============================Start Alarm Services=================================")
			self.logger.debug("\n-----------------------------------------------------------------------------------")
			self.logger.debug("Atempting to start the alarm services ")
			self.logger.debug("Checking if the button is present : %s",self.start)
			self.logger.debug("Clicking alarm services : %s",self.start)
			self.logger.debug("\n-----------------------------------------------------------------------------------")

			self.sync_element(self.start)
			self.start.click()
			time.sleep(5)

			return True
		except NoSuchElementException:
			self.logger.debug("error", "Element {} does not exist".format(self.start))
			return None		

	def stopAlarm(self):
		try:
			self.logger.info("\n===============================Stop Alarm Services==================================")
			self.logger.debug("\n-----------------------------------------------------------------------------------")
			self.logger.debug("Atempting to click the Stop Alarm ")
			self.logger.debug("Checking if the button is present : Stop Alarm")
			self.logger.debug("Clicking Stop Alarm : Stop Alarm")
			self.logger.debug("\n-----------------------------------------------------------------------------------")
			time.sleep(3)

			self.driver.find_element_by_xpath('//*[@text="Stop Alarm Service"]').click()
			time.sleep(3)
			self.logger.debug("\n The user goes back to main screen")
			self.driver.back()
			time.sleep(3)
			self.driver.back()
			time.sleep(3)
			self.driver.back()

			return True
		except NoSuchElementException:
			self.logger.debug("error", "Element {} does not exist: Stop Alarm")
			return None				

	def click_element(self, element = None):
		try:
			if (element == None):
				errorMsg = "Neither element or elementName can be None: element = {}; elementName = {}".format(str(element), elementName)
				self.auto_log("error", errorMsg)
				raise WebDriverException(errorMsg)
				return None
			else:
				self.auto_log("debug", "Clicking the " + str(element))
				# element.wait_until_visible(int(self.config.get('Test', 'wait')))
				# element.wait_until_clickable(int(self.config.get('Test', 'wait')))

				elementType = type(element)
				if "PageElement" in str(elementType):

					element.web_element.click()
				else:

					element.click()
					return self
		except NoSuchElementException:
			self.auto_log("error", "Element {} does not exist".format(element))
			return None
		except TimeoutException:
			self.auto_log("error", "Element {} not come into existence within {} seconds".format(element, int(self.config.get('Test', 'wait'))))
			return None

	def sync_element(self,element):
		try:
			if (element == None):
				errorMsg = "Neither element or elementName can be None: element = {}; elementName = {}".format(str(element), str(element))
				self.auto_log("error", errorMsg)
				raise WebDriverException(errorMsg)
				return None
			else:
				# element.wait_until_visible(int(self.config.get('Test', 'wait')))
				return self
		except NoSuchElementException:
			self.auto_log("error", "Element {} does not exist".format(element))
			return None
		except TimeoutException:
			self.auto_log("error", "Element {} not come into existence within {} seconds".format(element, int(self.config.get('Test', 'wait'))))
			return None

	def auto_log(self, level, message):
		func = inspect.currentframe().f_back.f_code
		if level.lower() == "debug":
			self.logger.debug("%s: %s in %s:%i" % (
				message, 
				func.co_name, 
				func.co_filename, 
				func.co_firstlineno
			))

		if level.lower() == "error":
			self.logger.error("%s: %s in %s:%i" % (
				message, 
				func.co_name, 
				func.co_filename, 
				func.co_firstlineno
			))

		if level.lower() == "info":
			self.logger.info("%s: %s in %s:%i" % (
				message, 
				func.co_name, 
				func.co_filename, 
				func.co_firstlineno
			))

