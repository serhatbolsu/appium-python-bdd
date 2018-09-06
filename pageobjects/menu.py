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
from appium.webdriver.common.mobileby import MobileBy
from toolium.pageobjects.page_object import PageObject


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
