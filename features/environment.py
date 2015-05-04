import os

from appium import webdriver


def before_feature(context, feature):
    app = os.path.join(os.path.dirname(__file__),
                       '../apps/TestApp/build/Release-iphonesimulator',
                       'TestApp.app')
    app = os.path.abspath(app)
    context.driver = webdriver.Remote(
        command_executor='http://127.0.0.1:4723/wd/hub',
        desired_capabilities={
            'app': app,
            'platformName': 'iOS',
            'platformVersion': '8.3',
            'deviceName': 'iPhone 6'
        })

def after_feature(context, feature):
    context.driver.quit()

