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
import F8Colors from "./F8Colors";
import F8Fonts from "./F8Fonts";
import { View, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Text } from "./F8Text";

const BUTTON_HEIGHT = 52;
const BUTTON_HEIGHT_SM = 32;

class F8Button extends React.Component {

  props: {
    theme: 
      | "pink"
      | "blue"
      | "yellow"
      | "fb"
      | "white"
      | "bordered"
      | "bordered-pink"
      | "disabled",
    type: "default" | "round" | "small",
    opacity: number,
    icon?: number,
    caption?: string,
    style?: any,
    fontSize?: number,

    onPress: () => mixed
  };

  static defaultProps = {
    opacity: 1,
    theme: 'pink'
  };

  static height = BUTTON_HEIGHT;

  render() {
    const { icon, fontSize, opacity } = this.props;
    const caption = this.props.caption && this.props.caption.toUpperCase();
    const { buttonTheme, iconTheme, captonTheme } = this.getTheme();
    const { containerType, buttonType, iconType, captionType } = this.getType();

    let iconImage;
    if (icon) {
      iconImage = (
        <Image source={icon} style={[styles.icon, iconTheme, iconType]} />
      );
    }

    let fontSizeOverride;
    if (fontSize) {
      fontSizeOverride = {fontSize};
    }

    const content = (
      <View style={[styles.button, buttonTheme, buttonType, { opacity }]}>
        {iconImage}
        <Text style={[styles.caption, captionTheme, captionType, fontSizeOverride]}>
          {caption}
        </Text>
      </View>
    );

    if(this.props.onPress) {
      return (
        <TouchableOpacity
          accessibilityTraits="button"
          onPress={this.props.onPress}
          activeOpacity={0.5}
          style={[styles.container, containerType, this.props.style]}
        >
          {content}
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={[styles.container, containerType, this.props.style]}>
          {content}
        </View>
      );
    }

  }

  getTheme() {
    const { theme } = this.props;
    let buttonTheme, iconTheme, captionTheme;
    if (theme === "yellow") {
      buttonTheme = { backgroundColor: F8Colors.yellow };
      iconTheme = { tintColor: F8Colors.pink };
      captionTheme = { color: F8Colors.pink };
    } else if (theme === "blue") {
      buttonTheme = { backgroundColor: F8Colors.blue };
      iconTheme = { tintColor: F8Colors.white };
      captionTheme = { color: F8Colors.white };
    } else if (theme === "fb") {
      buttonTheme = { backgroundColor: F8Colors.facebookBlue };
      iconTheme = { tintColor: F8Colors.white };
      captionTheme = { color: F8Colors.white };
    } else if (theme === "white") {
      buttonTheme = { backgroundColor: F8Colors.white };
      iconTheme = { tintColor: F8Colors.pink };
      captionTheme = { color: F8Colors.pink };
    } else if (theme === "bordered") {
      buttonTheme = {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: F8Colors.tangaroa
      };
      iconTheme = { tintColor: F8Colors.tangaroa };
      captionTheme = { color: F8Colors.tangaroa };
    } else if (theme === "bordered-pink") {
      buttonTheme = {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: F8Colors.pink
      };
      iconTheme = { tintColor: F8Colors.pink };
      captionTheme = { color: F8Colors.pink };
    } else if (theme === "maps") {
      buttonTheme = {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: F8Colors.purple
      };
      iconTheme = { tintColor: F8Colors.tangaroa };
      captionTheme = { color: F8Colors.tangaroa };
    } else if (theme === "mapsInactive") {
      buttonTheme = {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "transparent"
      };
      iconTheme = { tintColor: F8Colors.tangaroa };
      captionTheme = { color: F8Colors.tangaroa };
    } else if (theme === "disabled") {
      buttonTheme = { backgroundColor: F8Colors.blueBayoux };
      iconTheme = { tintColor: F8Colors.white, opacity: 0.5 };
      captionTheme = { color: F8Colors.white, opacity: 0.5 };
    } else if (theme === "transparent") {
      buttonTheme = { backgroundColor: "transparent" };
      iconTheme = { tintColor: F8Colors.tangaroa };
      captionTheme = { color: F8Colors.tangaroa };
    } else {
      // pink/white is default
      buttonTheme = { backgroundColor: F8Colors.pink };
      iconTheme = { tintColor: "white" };
      captionTheme = { color: "white" };
    }

    return { buttonTheme, iconTheme, captionTheme };
  }

  getType() {
    const { type } = this.props;
    let containerType, buttonType, iconType, captionType;

    if (type === 'round') {
      buttonType = { width: BUTTON_HEIGHT, paddingHorizontal: 0 }
      iconType = { marginRight: 0};
      captionType = { fontSize: 13};
    } else if (type === 'small') {
      containerType = { height: BUTTON_HEIGHT_SM};
      buttonType = { paddingHorizontal: 15 };
      iconType = {marginRight: 0};
      captionType = { fontSize: 13};
    } else {
      // defaults
    }

    return { containerType, buttonType, iconType, captionType};
  }

}

const styles = StyleSheet.create({
  container: {
    height: BUTTON_HEIGHT,
  },

  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    borderRadius: BUTTON_HEIGHT / 2
  },

  buttonRound: {
    width: BUTTON_HEIGHT,
    paddingHorizontal: 0,
  },

  icon: {
    marginRight: 12,
  },
  caption: {
    fontFamily: F8Fonts.button,
    fontSize: 15,
    textAlign: 'center'
  }
});

const Button = F8Button;
Button.__cards__ = define => {
  define('default (pink)', () => (
    <F8Button
      caption="default (pink)"
      onPress={_ => Alert.alert("default (pink) pressed!")}
    />
  ));
}

module.exports = Button;
