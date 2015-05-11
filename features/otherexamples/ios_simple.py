"""
More involved iOS tests, using UICatalog application.
"""
import unittest
import os
import random
import string
from appium import webdriver
from appium.webdriver.common.touch_action import TouchAction
# from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.touch_actions import TouchActions
# from selenium.webdriver.common.keys import Keys
import urllib2
import json
from time import sleep

def str_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))


class ComplexIOSTests(unittest.TestCase):

    def setUp(self):
        # set up appium
        # ** Important Note **
        # Make sure you have build the UICatalog applcation in your local repository
        app = os.path.join(os.path.dirname(__file__),
                           '/Users/efevngrs/Downloads/Payload 2',
                           'Butcele.app')
        app = os.path.abspath(app)
        self.driver = webdriver.Remote(
            command_executor='http://127.0.0.1:4723/wd/hub',
            desired_capabilities={
                'app': app,
                'platformName': 'iOS',
                'platformVersion': '8.3',
                'deviceName': 'iPhone 5s'
            })
        self._values = []

    def tearDown(self):
        self.driver.quit()

    def _open_menu_position(self, index):
        # Opens up the menu at position [index] : starts at 0.
        table = self.driver.find_element_by_class_name("UIATableView")
        self._row = table.find_elements_by_class_name("UIATableCell")[index]
        self._row.click()



suite = unittest.TestLoader().loadTestsFromTestCase(ComplexIOSTests)
unittest.TextTestRunner(verbosity=2).run(suite)