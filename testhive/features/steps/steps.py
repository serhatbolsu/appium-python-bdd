from time import sleep
from behave import *

use_step_matcher("re")

@given("ios application is opened")
def step_impl(context):
    pass


@when("move to maps")
def step_impl(context):

    els = context.driver.find_elements_by_class_name('UIAButton')
    els[5].click()


    sleep(2)
    try:
        el = context.driver.find_element_by_accessibility_id('OK')
        el.click()
        sleep(2)
    except:
        pass


@then("I should be able to scroll")
def step_impl(context):
    el = context.driver.find_element_by_xpath('//UIAMapView[1]')
    location = el.location
    context.driver.swipe(start_x=location['x'], start_y=location['y'], end_x=0.5, end_y=location['y'], duration=800)




