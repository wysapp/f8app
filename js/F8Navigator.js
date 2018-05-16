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

import React from "react";
import Platform from "Platform";
import BackAndroid from 'BackAndroid';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { Navigator } from "react-native-deprecated-custom-components";

import F8TabsView from "./tabs/F8TabsView";
import F8MapView from './tabs/maps/F8MapView';
import DemosCarousel from "./tabs/demos/DemosCarousel";

import F8Colors from './common/F8Colors';
import { switchTab } from "./actions";

const F8Navigator = React.createClass({
  _handlers: ([]: Array<() => boolean>),

  componentDidMount: function() {
    BackAndroid.addEventListener("hardwareBackPress", this.handleBackButton);
  },

  componentWillUnmount: function() {
    BackAndroid.removeEventListener("hardwareBackPress", this.handleBackButton);
  },

  getChildContext() {
    return {
      addBackButtonListener: this.addBackButtonListener,
      removeBackButtonListener: this.removeBackButtonListener
    };
  },

  addBackButtonListener: function(listener) {
    this._handlers.push(listener);
  },

  removeEventListener: function(listener) {
    this._handlers = this._handlers.filter(handler => handler !== listener);
  },

  handleBackButton: function() {
    console.log('fffffffffffffffffffffffff-backandroid-event-hardwareBackPress');
    for(let i = this._handlers.length - 1; i >= 0; i--) {
      if (this._handlers[i]()) {
        return true;
      }
    }

    const navigator = this._navigator;
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop();
      return true;
    }

    if (this.props.tab !== 'schedule') {
      this.props.dispatch(switchTab("schedule"));
      return true;
    }
    return false;
  },

  render: function() {

    return (
      <Navigator
        ref={ c=> (this._navigator = c)}
        style={styles.container}
        configureScene={route => {
          if (Platform.OS === 'android') {
            return Navigator.SceneConfigs.FloatFromBottomAndroid;
          }

          if (
            route.shareSettings ||
            route.friend ||
            route.webview ||
            route.video ||
            route.session ||
            route.allSession ||
            route.allDemos
          ) {
            return Navigator.SceneConfigs.PushFromRight;
          } else {
            Navigator.SceneConfigs.FloatFromBottom;
          }
        }}
        initialRoute={{}}
        renderScene={this.renderScene}
      />
    )
  },

  renderScene: function(route, navigator) {
    if (route.allSessions) {
    } else if (route.maps) {
      return <F8MapView direction={false} navigator={navigator} />;

    } else if (route.allDemos) {
      return <DemosCarousel {...route} navigator={navigator} />;
    } else {
      return <F8TabsView navigator={navigator} />
    }
  }
});

F8Navigator.childContextTypes = {
  addBackButtonListener: React.PropTypes.func,
  removeBackButtonListener: React.PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: F8Colors.bianca
  }
});

function select(store) {
  return {
    tab: store.navigation.tab,
    isLoggedIn: store.user.isLoggedIn || store.user.hasSkippedLogin
  };
}

module.exports = connect(select)(F8Navigator);
