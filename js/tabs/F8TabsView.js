/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 */

"use strict";


import React from 'react';
import { PixelRatio, Platform, View, Text, Image, StatusBar } from "react-native";
import { Navigator } from "react-native-deprecated-custom-components";
import TabNavigator from 'react-native-tab-navigator';
import { connect } from "react-redux";

import GeneralScheduleView from "./schedule/GeneralScheduleView";
import F8InfoView from "./info/F8InfoView";
import MyScheduleView from "./schedule/MyScheduleView";
import F8VideosView from "./videos/F8VideosView";
import F8DemosView from "./demos/F8DemosView";


import { switchTab } from "../actions";
import type {Tab, Day} from '../reducers/navigation';

import F8Fonts from '../common/F8Fonts';
import F8Colors from '../common/F8Colors';
import StyleSheet from '../common/F8StyleSheet';

import { currentTimeOnConferenceDay } from "../common/convertTimes";


const SCHEDULE_ICONS = {
  day1: {    
    default: require("./schedule/img/tab-icon/1/default.png"),
    active: require("./schedule/img/tab-icon/1/active.png")
  },
  day2: {
    default: require("./schedule/img/tab-icon/2/default.png"),
    active: require("./schedule/img/tab-icon/2/active.png")
  }
};

const BADGE_SIZE = 14,
      BADGE_PADDING_H = 3,
      UPDATE_LOOP_MINUTES = 1,
      UPDATE_LOOP_DURATION = UPDATE_LOOP_MINUTES * 60 * 1000;

class F8TabsView extends React.Component {
  props: {
    tab: Tab,
    day: Day,
    onTabSelect: (tab: Tab) => void,
    navigator: Navigator
  };

  constructor(props) {
    super(props);

    this.state = {
      now: props.presetDate
        ? currentTimeOnConferenceDay(props.presetDate)
        : new Date().getTime()
    };

  }

  onTabSelect(tab: Tab) {
    if (this.props.tab !== tab) {
      this.props.onTabSelect(tab);
    }
  }

  render() {
    
    let scheduleIcon = SCHEDULE_ICONS.day1.default;
    let scheduleIconSelected = SCHEDULE_ICONS.day1.active;
    if (this.props.day === 2) {
      scheduleIcon = SCHEDULE_ICONS.day2.default;
      scheduleIconSelected = SCHEDULE_ICONS.day2.active;
    }

    return (
      <TabNavigator tabBarStyle={styles.tabBar}>
        <TabNavigator.Item
          title="Schedule"
          titleStyle={styles.tabTitle}
          selectedTitleStyle={styles.tabTitleActive}
          selected={this.props.tab === "schedule"}
          onPress={this.onTabSelect.bind(this, "schedule")}
          renderIcon={_ => this.renderTabIcon(scheduleIcon)}
          renderSelectedIcon={_ => this.renderTabIcon(scheduleIconSelected)}
        >
          <GeneralScheduleView
            now={this.state.now}
            navigator={this.props.navigator}
          />
        </TabNavigator.Item>

        <TabNavigator.Item
          title="My F8"
          titleStyle={styles.tabTitle}
          selectedTitleStyle={styles.tabTitleActive}
          selected={this.props.tab === "myF8"}
          onPress={this.onTabSelect.bind(this, "myF8")}
          renderIcon={_ =>
            this.renderTabIcon(
              require("./schedule/img/tab-icon/my-f8/default.png")
            )}
          renderSelectedIcon={_ =>
            this.renderTabIcon(
              require("./schedule/img/tab-icon/my-f8/active.png")
            )}
        >
          <MyScheduleView
            now={this.state.now}
            navigator={this.props.navigator}
          />
          
        </TabNavigator.Item>

        <TabNavigator.Item
          title="Demos"
          titleStyle={styles.tabTitle}
          selectedTitleStyle={styles.tabTitleActive}
          selected={this.props.tab === "demos"}
          onPress={this.onTabSelect.bind(this, "demos")}
          renderIcon={_ =>
            this.renderTabIcon(require("./demos/img/tab-icon/default.png"))}
          renderSelectedIcon={_ =>
            this.renderTabIcon(require("./demos/img/tab-icon/active.png"))}
        >
          <F8DemosView navigator={this.props.navigator} />
        </TabNavigator.Item>

        <TabNavigator.Item
          title="Videos"
          titleStyle={styles.tabTitle}
          selectedTitleStyle={styles.tabTitleActive}
          selected={this.props.tab === "videos"}
          onPress={this.onTabSelect.bind(this, "videos")}
          renderIcon={_ =>
            this.renderTabIcon(require("./videos/img/tab-icon/default.png"))}
          renderSelectedIcon={_ =>
            this.renderTabIcon(require("./videos/img/tab-icon/active.png"))}
        >
          <F8VideosView navigator={this.props.navigator} />
        </TabNavigator.Item>

        <TabNavigator.Item
          title="Information"
          titleStyle={styles.tabTitle}
          selectedTitleStyle={styles.tabTitleActive}
          selected={this.props.tab === "info"}
          onPress={this.onTabSelect.bind(this, "info")}
          renderBadge={_ => <TabBadge value={1} />}          
          renderIcon={_ =>
            this.renderTabIcon(require("./info/img/tab-icon/default.png"))}
          renderSelectedIcon={_ =>
            this.renderTabIcon(require("./info/img/tab-icon/active.png"))}
        >
          <F8InfoView navigator={this.props.navigator} />
        </TabNavigator.Item>

      </TabNavigator>
    );
  }

  renderTabIcon(src) {
    return (
      <View style={styles.iconWrapper}>
        <Image style={styles.tabIcon} source={src} />
      </View>
    );
  }
}

class TabBadge extends React.Component {
  render() {
    if (!this.props.value) {
      return null;
    }

    const len = String(this.props.value).length;
    let sizing;
    if (len > 1) {
      sizing = styles.badgeFlexible;
    } else {
      sizing = styles.badgeFixed;
    }

    return (
      <View style={[styles.badge, sizing]}>
        <Text style={styles.badgeText}>{this.props.value}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: F8Colors.magnesium,
    backgroundColor: F8Colors.lightBackground
  },
  tabTitle: {
    backgroundColor: "transparent",
    fontSize: 10,
    color: F8Colors.colorWithAlpha("sapphire", 0.65),
  },
  tabTitleActive: {
    color: F8Colors.sapphire,
  },

  badge: {
    position: 'absolute',
    right: -5,
    top: 2,
    backgroundColor: F8Colors.pink,
    borderRadius: BADGE_SIZE / 2,
    height: BADGE_SIZE,
    alignItems: "center",
    justifyContent: "center"
  },
  badgeFixed: {
    width: BADGE_SIZE
  },
  badgeFlexible: {
    paddingHorizontal: BADGE_PADDING_H,
  },

  iconWrapper: {
    width: 28,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: -3,
  },
  badgeText: {
    backgroundColor: "transparent",
    fontSize: 9,
    fontFamily: F8Fonts.fontWithWeight(F8Fonts.basis, "helveticaBold"),
    color: F8Colors.white,

    ios: {
      lineHeight: 10
    }
  },

  tabIcon: {

  }
});

function select(store) {
  return {
    tab: store.navigation.tab,
    day: store.navigation.day,
    presetDate: store.testEventDates,

  };
}

function actions(dispatch) {
  return {
    onTabSelect: tab => dispatch(switchTab(tab))
  };
}

module.exports = connect(select, actions)(F8TabsView);


