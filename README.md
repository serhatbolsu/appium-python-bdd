Appium Basic Test Cases for Behave (BDD)
========================================

These are sample test cases for Testhive workshop and general usage that can get you familiar with Appium.
BDD framework used is Behave which is an Cucumber clone for Python. 
Mobil Test Automation framework is Appium which is most supported right now.

Install Behave and Appium:

```shell
pip install appium-python-client
pip install behave

# For SauceLabs remote connection
# !! Make sure your environment variables have: SAUCE_USERNAME and SAUCE_ACCESS_KEY variables set
pip install sauceclient
```

Usage: 

```shell
# In order to select configuration you need to set tags in execution
behave --tags=ios ios_simple.feature
```

