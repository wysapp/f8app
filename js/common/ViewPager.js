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
import { View,StyleSheet, ScrollView, ViewPagerAndroid, Platform } from "react-native";

type Props = {
  count: number,
  selectedIndex: number,
  onSelectedIndexChange?: (index: number) => void,
  bounces?: boolean,
  children?: any,
  style?: any
};

type State = {
  width: number,
  height: number,
  selectedIndex: number,
  initialSelectedIndex: number,
  scrollingTo: ?number
};

class ViewPager extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      selectedIndex: this.props.selectedIndex,
      initialSelectedIndex: this.props.selectedIndex,
      scrollingTo: null
    };
  }

  render() {
    if(Platform.OS ==='ios') {
      return this.renderIOS();
    } else {
      return this.renderAndroid();
    }
  }

  renderAndroid() {
    return (
      <ViewPagerAndroid
        ref={c => (this._scrollview = c)}
        initialPage={this.state.initialSelectedIndex}
        onPageSelected={this.handleHorizontalScroll}
        style={styles.container}
      >
        {this.renderContent()}
      </ViewPagerAndroid>
    );
  }

  renderContent(): Array<ReactElement> {
    const { width, height } = this.state;
    const style = Platform.OS === "ios" && styles.card;
    return React.Children.map(this.props.children, (child, i) => (
      <View style={[style, {width, height}]} key={"r_" + i}>
        {child}
      </View>
    ));
  }

  handleHorizontalScroll = (e: any) => {

  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  card: {
    backgroundColor: "transparent"
  }
});

module.exports = ViewPager;

