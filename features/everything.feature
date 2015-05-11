Feature: showing off behave

  Scenario: run a simple test
    Given we have behave installed
    When we implement a test
    Then behave will test it for us!


  Scenario: Successful Login
    Given phone and pass info:
        |  Phone    |   7997991111  |
        |  Pass     |   456123      |

    When nofitications allowed
    Then should be able to login
