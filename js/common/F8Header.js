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
import { Dimensions, View, Image, ToolbarAndroid, Platform, TouchableOpacity, Alert } from "react-native";

import { Text, HeaderTitle } from "./F8Text";
import F8Colors from './F8Colors';
import F8Fonts from './F8Fonts';
import StyleSheet from './F8StyleSheet';


let STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : 25;
if (Platform.OS === 'android' && Platform.Version && Platform.Version < 21) {
  STATUS_BAR_HEIGHT = 0;
}

const HEADER_HEIGHT = Platform.OS === "ios" ? 45 + STATUS_BAR_HEIGHT : 60 + STATUS_BAR_HEIGHT;
const SCREEN_WIDTH = Dimensions.get("window").width;
const IOS_ITEM_TEXT_SIZE = SCREEN_WIDTH < 375 ? 10 : 13;

const FAVORITE_ICON_WIDTH = 37,
      FAVORITE_ICON_HEIGHT = 31;


export type Layout = 
  | "default"
  | "icon"
  | "title";

export type Item = {
  title?: string,
  icon?: number,
  layout?: Layout,
  onPress?: () => void
};

export type Props = {
  title?: string,
  leftItem?: Item,
  rightItem?: Item,
  extraItems?: Array<Item>,
  style?: any,
  children?: any
};

class F8HeaderAndroid extends React.Component {
  static height: number;
  props: Props;

  static defaultProps = {
    backgroundColor: F8Colors.blue,
    titleColor: F8Colors.yellow,
    itemsColor: F8Colors.white
  };

  constructor() {
    super();

    this.limitActionSelection = false;
  }

  render() {
    const {
      navItem,
      leftItem,
      rightItem,
      extraItems,
      backgroundColor,
      titleColor
    } = this.props;

    let actions = [];
    if (leftItem) {
      const { title, icon, layout } = leftItem;
      actions.push({
        icon: layout !== "title" ? icon : undefined,
        title: title,
        show: "always"
      });
    }
    if (rightItem) {
      const { title, icon, layout } = rightItem;
      actions.push({
        icon: layout !== "title" ? icon : undefined,
        title: title,
        show: "always"
      });
    }
    if (extraItems) {
      actions = actions.concat(
        extraItems.map(item => ({
          title: item.title,
          show: "never"
        }))
      );
    }

    let content;
    if (React.Children.count(this.props.children) > 0) {
      content = (
        <View collapsable={false} style={{ flex: 1 }}>
          {this.props.children}
        </View>
      );
    } else {
      content = (
        <View collapsable={false} style={{ flex: 1, justifyContent: "center" }}>
          <HeaderTitle numberOfLines={1} style={{ color: titleColor }}>
            {this.props.title}
          </HeaderTitle>
        </View>
      );
    }

    return (
      <View style={[styles.header, { backgroundColor }, this.props.style]}>
        <ToolbarAndroid
          navIcon={navItem && navItem.icon}
          onIconClicked={navItem && navItem.onPress}
          title={this.props.title}
          titleColor={titleColor}
          subtitleColor={titleColor}
          actions={actions}
          onActionSelected={this.handleActionSelected.bind(this)}
          style={styles.toolbar}
        >
          {content}
        </ToolbarAndroid>
        <Text style={{ height: 0, opacity: 0 }}>{actions.length || 0}</Text>
      </View>
    );
  }

  handleActionSelected(position: number) {
    if (this.limitActionSelection) {
      return;
    }

    let items = this.props.extraItems || [];
    if (this.props.rightItem) {
      items = [this.props.rightItem, ...items];
    }
    if (this.props.leftItem) {
      items = [this.props.leftItem, ...items];
    }

    const item = items[position];
    item && item.onPress && item.onPress();
    
    this.limitActionSelection = true;
    setTimeout(() => {
      this.limitActionSelection = false;
    }, 1000);
  }
}

class F8HeaderIOS extends React.Component {
  static height: number;
  props: Props;

  static defaultProps = {

    backgroundColor: F8Colors.blue,
    titleColor: F8Colors.yellow,
    itemsColor: F8Colors.white
  };

  render() {

    const {
      navItem,
      leftItem,
      rightItem,
      title,
      backgroundColor,
      titleColor,
      itemsColor
    } = this.props;

    let left;
    if (navItem) {
      if (navItem.back) {
        navItem.icon = require("./img/header/back.png");
      }
    }
    
    return null;
  }
}

const styles = StyleSheet.create({
  toolbar: {
    android: {
      height: HEADER_HEIGHT - STATUS_BAR_HEIGHT
    }
  },
  header: {
    android: {
      paddingTop: STATUS_BAR_HEIGHT,
    },
    ios: {
      backgroundColor: 'transparent',
      paddingTop: STATUS_BAR_HEIGHT,
      height: HEADER_HEIGHT,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    }
  },
  titleTextDivider: {
    android: {
      position: 'absolute',
      height: 1,
      bottom: 0,
      backgroundColor: F8Colors.accent
    }
  },
  leftItem: {
    flex: 1,
    alignItems: "flex-start",
  }
});

const Header = Platform.OS === 'ios' ? F8HeaderIOS : F8HeaderAndroid;
Header.height = HEADER_HEIGHT;

Header.__cards__ = define => {

  define("Simple", () => <Header title="Hello, world" type="underline" />);
};

module.exports = Header;

