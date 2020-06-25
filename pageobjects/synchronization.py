from toolium.pageobjects.page_object import PageObject
from toolium.pageelements import *

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import WebDriverException

import time

class Synchronization():

    instance = None

    @classmethod
    def get(cls):
        if cls.instance is None:
            cls.instance = cls()
        return cls.instance

    def __init__(self):
        driver = None
        waitPeriod = 0
        wait = None

    def set_driver(self, driver):
        self.driver = driver

    def set_web_driver_wait(self, driver, wait, logger):
        self.waitPeriod = wait
        self.wait = WebDriverWait(driver, wait)
        self.driver = driver
        self.logger = logger

    def wait_for_page_to_load(self, page_name, page_title):
        try:
            self.logger.debug("Loading Page {} with page title {} ".format(page_name, page_title))
            return self.wait.until(lambda driver:driver.title.lower() == (page_title.lower()))
        except TimeoutException:
            self.logger.debug("Failed to load Page {} with page title {} within the specified wait time of {} seconds".format(page_name, page_title, self.waitPeriod))
            return False

    def wait_on_element_text(self, by_type, by_value, text):
        try:
            self.logger.debug("Waiting for the text value of webelement defined by attribute {} = {} to change to {}".format(by_type, by_value, text))
            return self.wait.until(EC.text_to_be_present_in_element((by_type, by_value), text))
        except TimeoutException:
            self.logger.debug("The text value of webelement defined by attribute {} = {} did not change to {} within the specified wait time of {} seconds".format(by_type, by_value, text, self.waitPeriod))
            return False

    def is_attribute_value_equal_to(self, element, attribute_name, expected_value, wait):
        count = 0
        flag = False
        actual_value = element
        #actual_value = element.get_attribute(attribute_name)
        while (flag == False) and (count < wait):
            if (actual_value.strip() == expected_value.strip()):
                flag = True
            else:
                actual_value = element
                #actual_value = element.get_attribute(attribute_name)
                self.logger.debug('Synchronization.is_attribute_value.{}_{} = {}'.format(count, attribute_name, actual_value))
                time.sleep(1)
                count+=1
        return flag

    def wait_for_element_located(self, find_by, find_by_value):
        try:
            return self.wait.until(EC.presence_of_element_located((find_by, find_by_value)))
        except NoSuchElementException:
            self.logger.debug("Element was not present within {} seconds".format(self.config.get('Test', 'wait')))
      
    def wait_on_element_visibility(self, find_by, find_by_value):
        try:
            return self.wait.until(EC.visibility_of_element_located((find_by, find_by_value)))
        except NoSuchElementException:
            self.logger.debug("Element was not visible within {} seconds".format(self.waitPeriod))

    def wait_for_element_to_clickable(self, find_by, find_by_value, find_by_id, wait):
        try:
            return self.wait.until(EC.element_to_be_clickable((find_by, find_by_value, find_by_id, wait)))
        except NoSuchElementException:
            self.logger.debug("Search element did not come into existence within {} seconds".format(self.waitPeriod))
                       
    def is_attribute_modal_title_equal_to(self, element, expected_value, wait):
        count = 0
        flag = False
        #actual_value = element.get_attribute("textContent")
        actual_value = element
        while (flag == False) and (count < wait):
            if expected_value.strip().lower() in actual_value.strip().lower():
                flag = True
            else:
                actual_value = element
                #actual_value = element.get_attribute("textContent")
                self.logger.debug('Title of modal does not contain text {}'.format(expected_value))
                time.sleep(1)
                count+=1
        return flag

    def wait_for_page_title_to_equal(self, page_name, page_title):
        try:
            self.logger.debug("Loading Page {} with page title {} ".format(page_name, page_title))
            if (self.wait.until(lambda driver:driver.title.lower() == (page_title.lower()))):
                self.logger.debug("Successfully loaded Page {} with page title {} ".format(page_name, page_title))
                return True
            else:
                self.logger.error("Failed to load Page {} with page title {} ".format(page_name, page_title))
                self.logger.error("Expected page title is {} and the actual page title is {} ".format(page_title, (self.driver.title).lower()))
                return False
        except TimeoutException as e:
            self.logger.error("Toolium threw a timeout exception: {}".format(e.__str__()))
            return False
        except WebDriverException as e:
            self.logger.error("Webdriver threw an execption {}".format(e.__str__()))
            return False

    def wait_ajax(self):
        try:
            return self.wait.until(lambda driver: driver.execute_script("return jQuery.active == 0"))
        except WebDriverException:
            self.logger.debug("wait_ajax threw a Webdriver Execption with in {} seconds".format(self.waitPeriod))
            return False


    def click_element(self, element = None):
        try:
            if (element == None):
                errorMsg = "Neither element or elementName can be None: element = {}; elementName = {}".format(str(element), elementName)
                self.auto_log("error", errorMsg)
                raise WebDriverException(errorMsg)
                return None
            else:
                self.auto_log("debug", "Clicking the " + str(element))
                element.wait_until_visible(int(self.config.get('Test', 'wait')))
                element.wait_until_clickable(int(self.config.get('Test', 'wait')))


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