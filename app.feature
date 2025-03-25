Feature: User Registration

    Scenario: Successful user registration
        Given I am on the registration page
        When I fill in the registration form with valid details
        And I submit the form
        Then I should see a confirmation message
        And I should receive a confirmation email

    Scenario: Registration with missing required fields
        Given I am on the registration page
        When I submit the form without filling in all required fields
        Then I should see an error message indicating the missing fields

    Scenario: Registration with invalid email
        Given I am on the registration page
        When I fill in the registration form with an invalid email
        And I submit the form
        Then I should see an error message indicating the invalid email

    Scenario: Registration with already registered email
        Given I am on the registration page
        When I fill in the registration form with an email that is already registered
        And I submit the form
        Then I should see an error message indicating the email is already in use