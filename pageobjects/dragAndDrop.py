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

from random import randint

# from pageobjects.synchronization import Synchronization
# from android_behave.pageobjects.synchronization import Synchronization
from android_behave.pageobjects.synchronization import Synchronization

from appium.webdriver.common.touch_action import TouchAction

from toolium.pageobjects.page_object import PageObject
from selenium.common.exceptions import NoSuchElementException

from selenium.webdriver.common.by import By
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
from selenium.webdriver.support.ui import WebDriverWait as wait
from selenium.webdriver.support import expected_conditions as EC

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.remote.command import Command

from actions import action, Action, Actions

import random
import string
import time

import inspect


class TabsPageObject(PageObject):

	sync = Synchronization.get()
	
	def viewsTab(self):
		try:
			self.logger.info("\n===============================Views Button=========================================")
			self.logger.debug("\n-----------------------------------------------------------------------------------")
			self.logger.debug("Atempting to click the Views button ")
			self.logger.debug("Checking if the button is present : viewsButton")
			self.logger.debug("Clicking Views : viewsButton")
			self.logger.debug("\n-----------------------------------------------------------------------------------")

			self.logger.debug("Scrolling Views into view.")

			time.sleep(3)
			self.driver.find_element_by_xpath('//*[@text="Views"]').click()
			return True

		except NoSuchElementException:
			self.logger.debug("error", "Element {} does not exist")
			return None		

	def viewsDragAndDrop(self):
		try:
			self.logger.info("\n===============================Drag and Drop Button=================================")
			self.logger.debug("\n-----------------------------------------------------------------------------------")
			self.logger.debug("Atempting to click the Drag and Drop button ")
			self.logger.debug("Checking if the button is present : Drag and Drop")
			self.logger.debug("Clicking Drag and Drop : Drag and Drop")
			self.logger.debug("\n-----------------------------------------------------------------------------------")
			time.sleep(5)

			self.driver.find_element_by_xpath('//*[@text="Drag and Drop"]').click()
			time.sleep(5)
			return True

		except NoSuchElementException:
			self.logger.debug("error", "Element {} does not exist: Drag and Drop")
			return None				

	def dragAndDropElement(self):
		try:
			self.logger.info("\n===============================Drag and Drop Button=================================")
			self.logger.debug("\n-----------------------------------------------------------------------------------")
			self.logger.debug("Atempting to Drag and Drop bubble ")
			self.logger.debug("Checking if the bubble is present : Drag and Drop")
			self.logger.debug("Drag and Drop : Dragging bubble")
			self.logger.debug("\n-----------------------------------------------------------------------------------")
			time.sleep(5)

			self.actions = TouchAction(self.driver)

			self.dragabble = self.driver.find_element_by_id("io.appium.android.apis:id/drag_dot_1")
			self.droppabble = self.driver.find_element_by_id("io.appium.android.apis:id/drag_dot_2")

			self.actions.long_press(self.dragabble).move_to(self.droppabble).release().perform()
			return True

		except NoSuchElementException:
			self.logger.debug("error", "Element {} does not exist: droppable bubble")
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