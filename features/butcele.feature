@ios
@butcele
Feature: Butcele test cases
  Scenario: Successful Login
    Given phone and pass info:
        |  Phone    |   7997991111  |
        |  Pass     |   456123      |

    When nofitications allowed
    Then should be able to login
