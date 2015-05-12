@android
Feature: Imdb basic tests
  @current
  Scenario: login test for IMDb
    Given user is logged in with correct credientials
    When user clone ad banner
    Then capture screenshot
    Then menu should be present
    Then user should be able to logout
    Then page should have sign-in button

  Scenario: Share a movie with Email
    When user search for movie: "Matrix"
    And user clone ad banner
    Then movie: "Matrix" should be in the results
    Then user should be able to send email to: "devicelab@qualifylabs.com"