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
 *
 * @flow
 */

"use strict";

import React from 'react';
import { AppState, StyleSheet, StatusBar, View } from "react-native";
import { connect } from "react-redux";
import F8Navigator from './F8Navigator';
import LoginScreen from './login/LoginScreen';
import { version } from './env';
import { loadSessions } from "./actions";

class F8App extends React.Component {

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);

    this.props.dispatch(loadSessions());
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  handleAppStateChange = appState => {
    console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyy----F8App---appState', appState);
    if (appState === 'active') {
      this.props.dispatch(loadSessions());
    }
  };

  render() {
    if (!this.props.skipWelcomeScreen) {
      return <LoginScreen />;
    }

    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent={true}
          backgroundColor="rgba(0, 0, 0, 0)"
          barStyle="light-content"
        />
        <F8Navigator />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
    skipWelcomeScreen: store.user.isLoggedIn || store.user.hasSkippedLogin
  };
}

module.exports = connect(select)(F8App);
