import os
from time import sleep

from appium import webdriver


def before_all(context):
    # context.config.setup_logging()
    pass

def before_feature(context, feature):
    if 'android' in feature.tags:
        app = os.path.join(os.path.dirname(__file__),
                           '../apps/Imdb/android',
                           'com.imdb.mobile.apk')
        app = os.path.abspath(app)
        context.driver = webdriver.Remote(
            command_executor='http://127.0.0.1:4723/wd/hub',
            desired_capabilities={
                'app' : app,
                'platformName' : 'Android',
                'platformVersion' : '4.4',
                'deviceName' : None,
                'udid' : '01a135891395669f',
                'appActivity' : '.HomeActivity',
                'appPackage' : 'com.imdb.mobile'
            }
        )
    elif 'ios' in feature.tags and 'simple' in feature.tags:
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
                # 'udid' : '03ecba20f42e7fef25632d9b30cd0c8a5b447e92',
                # 'deviceName' : None
                'deviceName': "iPhone 6" # Force device to run on simulator such as : iPhone 6
            })
    elif 'ios' in feature.tags and 'butcele' in feature.tags:
        app = os.path.join(os.path.dirname(__file__),
                           '../apps/Butcele',
                           'butcele.app')
        app = os.path.abspath(app)
        context.driver = webdriver.Remote(
            command_executor='http://127.0.0.1:4723/wd/hub',
            desired_capabilities={
                'app': app,
                'platformName': 'iOS',
                'platformVersion': '8.3',
                'deviceName': "iPhone 6" # Force device to run on simulator such as : iPhone 6
            })

def after_feature(context, feature):
    sleep(1)
    context.driver.save_screenshot("features/reports/screen_final.png")
    context.driver.quit()