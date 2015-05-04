from behave import *

@given('we have behave installed')
def step_impl(context):
    pass

@when('we implement a test')
def step_impl(context):
    assert True is not False

@then('behave will test it for us!')
def step_impl(context):
    assert context.failed is False


@given('button found')
def button_found(context):
    els = context.driver.find_elements_by_class_name('UIAButton')
    els[5].click()

@when('popup does not apper')
def popup_apper(context):
    pass

@then('should be able to swipe')
def swipe_should(context):
    el = context.driver.find_element_by_xpath('//UIAMapView[1]')

    location = el.location
    context.driver.swipe(start_x=location['x'], start_y=location['y'], end_x=0.5, end_y=location['y'], duration=800)
