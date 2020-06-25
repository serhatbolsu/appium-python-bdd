# -*- coding: utf-8 -*-

from toolium.pageobjects.page_object import PageObject
from selenium.common.exceptions import NoSuchElementException

from toolium.pageelements import *
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.select import Select
from appium.webdriver.common.mobileby import MobileBy
from selenium.webdriver.support import expected_conditions as EC
import selenium.webdriver.support.expected_conditions as WAITCON
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import WebDriverException
from selenium import webdriver
from toolium.pageelements import InputText, Button
from selenium.webdriver.support.ui import WebDriverWait

import random
import string
import time




class MenuPageObject(PageObject):
    option_locator = 'new UiScrollable(new UiSelector().scrollable(true).instance(0))' \
                     '.scrollIntoView(new UiSelector().text("{}").instance(0));'

    def open_option(self, option):
        """Search a menu option and click on it

        :param option: str with menu option
        :returns: this page object instance
        """
        self.driver.find_element(MobileBy.ANDROID_UIAUTOMATOR, self.option_locator.format(option)).click()
        return self

