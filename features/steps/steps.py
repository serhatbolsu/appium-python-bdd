from behave import *
from time import sleep
from appium import webdriver


@given('button found')
def button_found(context):
    els = context.driver.find_elements_by_class_name('UIAButton')
    els[5].click()

@when('popup does not appear')
def popup_appear(context):
    try:
        el = context.driver.find_element_by_accessibility_id('OK')
        el.click()
    except:
        pass
    finally:
        sleep(3)

@then('should be able to swipe')
def swipe_should(context):
    el = context.driver.find_element_by_xpath('//UIAMapView[1]')

    location = el.location
    context.driver.swipe(start_x=location['x'], start_y=location['y'],
                         end_x=0.5, end_y=location['y'], duration=800)



@given("user is logged in with correct credientials")
def step_impl(context):
    sleep(5)
    context.driver.find_element_by_xpath('//*[@text="Sign In"]').click()
    sleep(2)
    context.driver.find_element_by_xpath('//*[@text="IMDb"]').click()
    context.driver.find_element_by_xpath('//*[@text="Email"]').send_keys('devicelab@qualifylabs.com')
    context.driver.find_element_by_xpath('//*/android.widget.EditText[2]').send_keys('12345678')
    context.driver.find_element_by_xpath('//*[@text="Sign In"]').click()

@then("capture screenshot")
def step_impl(context):
    sleep(1)
    context.driver.save_screenshot("features/reports/screen_after_login.png")

@then("menu should be present")
def step_impl(context):
    context.driver.find_element_by_id('android:id/up').click()
    output = context.driver.page_source
    assert "nav_drawer_list_user_item_gradient" in output


@then("user should be able to logout")
def step_impl(context):
    context.driver.find_element_by_xpath('//*/android.widget.ImageButton[1]').click()
    context.driver.find_element_by_xpath('//*[@text="Sign Out"]').click()


@then("page should have sign-in button")
def step_impl(context):
    try:
        context.driver.find_element_by_id('android:id/up').click()
    except:
        pass
    elem = context.driver.find_element_by_xpath('//*[@text="Sign In"]')
    # print elem.is_displayed()
    assert elem.is_displayed() is True



@when('user search for movie: "{movie}"')
def step_impl(context, movie):
    sleep(2)
    context.driver.find_element_by_id('com.imdb.mobile:id/search').click()
    sleep(2)
    context.driver.find_element_by_id('android:id/search_src_text').send_keys(movie.lower())
    context.driver.keyevent(66)
    sleep(2)


@step("user clone ad banner")
def step_impl(context):
    sleep(2)
    try:
        context.driver.find_element_by_id('com.imdb.mobile:id/ad_banner_close_button').click()
    except:
        pass

@then('movie: "{movie_result}" should be in the results')
def step_impl(context,movie_result):
    movie_result = '//*[contains(@text,"{}")]'.format(movie_result)
    context.driver.find_element_by_xpath(movie_result).click()
    sleep(5)
    elem = context.driver.find_element_by_xpath(movie_result)
    assert elem.is_displayed() is True

@then('user should be able to send email to: "{email}"')
def step_impl(context, email):
    context.driver.find_element_by_id('com.imdb.mobile:id/menu_share').click()
    context.driver.find_element_by_xpath('//*[@text="E-posta"]').click()
    context.driver.find_element_by_id('com.android.email:id/to').send_keys(email)
    context.driver.find_element_by_id('com.android.email:id/send').click()



if __name__ == '__main__':
    context.driver = webdriver.Remote()