@ios
@butcele
Feature: Butcele test cases

  Scenario: Login and create monthly budget expenses
    Given phone and pin info "7997991111" "456123"
    When new budget named "2014 May" created and the budget is "1100"
    Then should be able to add an expense
