from behave import *
from time import sleep
from appium import webdriver

"""        BDD             """
"""        BUTCELE         """
"""        Scenario        """
x_path = "//UIAApplication[1]/UIAWindow[1]/UIAScrollView[1]/UIAWebView[1]/"



"""  LOGIN  """
"""  In login section all the elements
    assigned to a variable to send
    click & send_key actions """

@given('phone and pin info "{phone}" "{pin}"')
def login_section(context, phone, pin):
    sleep(3)
    try:
        Notify = context.driver.find_element_by_xpath('//UIAApplication[1]/UIAWindow[6]/UIAAlert[1]/UIACollectionView[1]/UIACollectionCell[2]')
        Notify.click()
    except:
        pass
    finally:
        sleep(1)

    """ enter phone number """
    t_phone = context.driver.find_element_by_xpath(x_path+'UIATextField[1]')
    t_phone.click()
    sleep(2)
    t_phone.send_keys(phone)

    t_button = context.driver.find_element_by_xpath(x_path+'UIAButton[1]')
    t_button.click()
    sleep(1)

    """ enter pin number """
    t_pin = context.driver.find_element_by_xpath(x_path+'UIATextField[1]')
    t_pin.click()
    t_pin.send_keys(pin)

    """" login  """
    pin_button = context.driver.find_element_by_xpath(x_path+'UIAButton[1]')
    pin_button.click()
    sleep(1)


"""  NEW  BUDGET  """
"""  In create budget section
    actions directly send from
    find element method """

@when('new budget named "{b_name}" created and the budget is "{budget}"')
def bugdet_section(context, b_name, budget):

    context.driver.find_element_by_xpath(x_path+'UIAStaticText[5]').click()
    context.driver.find_element_by_xpath(x_path+'UIAStaticText[3]').click()
    context.driver.find_element_by_xpath(x_path+'UIATextField[1]').click()
    context.driver.find_element_by_xpath(x_path+'UIATextField[1]').send_keys(b_name)
    context.driver.find_element_by_xpath(x_path+'UIAButton[2]').click()
    context.driver.find_element_by_xpath(x_path+'UIATextField[1]').click()
    context.driver.find_element_by_xpath(x_path+'UIATextField[1]').send_keys(budget)
    context.driver.find_element_by_xpath(x_path+'UIAButton[2]').click()
    context.driver.find_element_by_xpath(x_path+'UIAButton[2]').click()
    sleep(1)

    """ enters expense menu """
    context.driver.tap([(314, 602)], 1)
    sleep(1)


"""" NEW EXPENSE """
"""  In add budget expense section
    actions send from
    find element method.
    also appium's driver.tap action
    used for unvisible elements """
@then('should be able to add an expense')
def expense_section(context):

    context.driver.tap([(10, 103)], 1)
    sleep(1)
    context.driver.find_element_by_xpath(x_path+'UIATextField[1]').send_keys('330')
    sleep(1)
    context.driver.find_element_by_xpath(x_path+'UIAButton[3]').click()
    sleep(1)
    context.driver.find_element_by_xpath(x_path+'UIALink[1]/UIALink[1]/UIALink[2]/UIAStaticText[1]').click()
    sleep(10)


if __name__ == '__main__':
    context.driver = webdriver.Remote()
