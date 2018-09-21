@StartAlarm
Feature: Alarm Services

  Scenario: Start and stop alarm services
    Given the menu is open
     When the user goes to Alarm Services
     And the user starts the alarm service
	 And the user stops the alarm service

    #Then the user clicks back button