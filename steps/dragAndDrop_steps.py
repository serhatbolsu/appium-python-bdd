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
from behave import given, when, then
from android_behave.pageobjects.menu import MenuPageObject
from android_behave.pageobjects.dragAndDrop import TabsPageObject


@given('that the menu is open')
def step_impl(context):
    context.current_page = MenuPageObject()

# @when('the user goes to Alarm Services')
# def step_impl(context):
#     context.current_page.open_option('App').open_option('Alarm').open_option('Alarm Service')
#     context.current_page = TabsPageObject()

@when('the user opens Views tab')
def step_impl(context):
    context.current_page = TabsPageObject()
    context.current_page.viewsTab()

@when('the user clicks on drag and drop')
def step_impl(context):
    context.current_page = TabsPageObject()
    context.current_page.drag_element()

# @then('the second tab contains "{message}"')
# def step_impl(context, message):
#     assert message in context.current_page.content2.text
