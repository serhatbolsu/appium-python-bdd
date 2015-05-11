from behave import *
from time import sleep
from appium import webdriver

"""    BDD         """
"""    BUTCELE     """

@given('we have behave installed')
def step_impl(context):
    pass

@when('we implement a test')
def step_impl(context):
    assert True is not False

@then('behave will test it for us!')
def step_impl(context):
    assert context.failed is False

#context.driver  =webdriver.Remote()


"""    Successful Login        """
"""        Scenario            """
log_inf = {'user': '', 'pass': ''}
Phone   = "7997991111"
Pass    = "456123"
@given('phone and pass info')
def pass_info(context):
    pass
   # for row in context.table:
   #     print (row['Phone'])

@when('nofitications allowed')
def notification_pass(context):

    x_path = "//UIAApplication[1]/UIAWindow[1]/UIAScrollView[1]/UIAWebView[1]/"

    Notify = context.driver.find_element_by_xpath('//UIAApplication[1]/UIAWindow[6]/UIAAlert[1]/UIACollectionView[1]/UIACollectionCell[2]')
    Notify.click()
    sleep(1)

    """  LOGIN  """
    t_phone = context.driver.find_element_by_xpath(x_path+'UIATextField[1]')
    t_phone.click()
    sleep(2)
    t_phone.send_keys(Phone)

    t_button = context.driver.find_element_by_xpath(x_path+'UIAButton[1]')
    t_button.click()
    sleep(1)

    t_pin = context.driver.find_element_by_xpath(x_path+'UIATextField[1]')
    t_pin.click()
    t_pin.send_keys(Pass)

    pin_button = context.driver.find_element_by_xpath(x_path+'UIAButton[1]')
    pin_button.click()


    """  NEW  BUDGET  """
    tap_screen = context.driver.find_element_by_xpath(x_path+'UIAStaticText[5]')
    tap_screen.click()

    new_butce = context.driver.find_element_by_xpath(x_path+'UIAStaticText[3]')
    new_butce.click()

    b_name = context.driver.find_element_by_xpath(x_path+'UIATextField[1]')
    b_name.click()
    sleep(1)
    b_name.send_keys('New Budget')

    b_button = context.driver.find_element_by_xpath(x_path+'UIAButton[2]')
    b_button.click()

    b_limit = context.driver.find_element_by_xpath(x_path+'UIATextField[1]')
    b_limit.click()
    sleep(1)
    b_limit.send_keys('1100')

    b_add = context.driver.find_element_by_xpath(x_path+'UIAButton[2]')
    b_add.click()

    b_kaydet = context.driver.find_element_by_xpath(x_path+'UIAButton[2]')
    b_kaydet.click()
    sleep(2)


    """" NEW EXPENSE """
    context.driver.tap([(259, 503)], 1)

    e_limit = context.driver.find_element_by_xpath(x_path+'UIATextField[1]')
    e_limit.click()
    e_limit.send_keys('330')

    new_ex = context.driver.find_element_by_xpath(x_path+'UIAButton[3]')
    new_ex.click()

    b_details = context.driver.find_element_by_xpath(x_path+'UIALink[1]/UIALink[1]/UIALink[2]/UIAStaticText[1]')
    b_details.click()
    sleep(10)




@then('should be able to login')
def login_to_butcele(context):
    pass

   # el = context.driver.find_element_by_xpath('//UIAMapView[1]')
   # location = el.location
   # context.driver.swipe(start_x=location['x'], start_y=location['y'], end_x=0.5, end_y=location['y'], duration=800)
   # sleep(2)
