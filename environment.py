# -*- coding: utf-8 -*-

from toolium.behave.environment import (before_all as toolium_before_all, before_feature as toolium_before_feature,
                                        before_scenario as toolium_before_scenario,
                                        after_scenario as toolium_after_scenario,
                                        after_feature as toolium_after_feature, after_all as toolium_after_all)


def before_all(context):
    """Initialization method that will be executed before the test execution

    :param context: behave context
    """
    # Set Android as default environment
    context.config.userdata.setdefault('Config_environment', 'android')
    toolium_before_all(context)


def before_feature(context, feature):
    """Feature initialization

    :param context: behave context
    :param feature: running feature
    """
    toolium_before_feature(context, feature)


def before_scenario(context, scenario):
    """Scenario initialization

    :param context: behave context
    :param scenario: running scenario
    """
    toolium_before_scenario(context, scenario)


def after_scenario(context, scenario):
    """Clean method that will be executed after each scenario

    :param context: behave context
    :param scenario: running scenario
    """
    toolium_after_scenario(context, scenario)


def after_feature(context, feature):
    """Clean method that will be executed after each feature

    :param context: behave context
    :param feature: running feature
    """
    toolium_after_feature(context, feature)


def after_all(context):
    """Clean method that will be executed after all features are finished

    :param context: behave context
    """
    toolium_after_all(context)
