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
import {findNodeHandle, Animated, NativeModules, View} from 'react-native';

import F8Colors from './F8Colors';
import type { Item as HeaderItem } from './F8Header';

type Props = {
  title: string,
  leftItem?: HeaderItem,
  rightItem?: HeaderItem,
  extraItems?: Array<HeaderItem>,
  selectedSegment?: number,
  selectedSectionColor: string,
  backgroundImage: number,
  backgroundColor: string,
  parallaxContent?: ?ReactElement,
  stickyHeader?: ?ReactElement,
  onSegmentChange?: (segment: number) => void,
  children?: any
};

type State = {
  idx: number,
  anim: Animated.Value,
  stickyHeaderHeight: number
};

class ListContainer extends React.Component {
  props: Props;
  state: State;
  _refs: Array<any>;
  _pinned: any;

  static defaultProps = {
    selectedSectionColor: 'white'
  };

  static contextTypes = {
    openDrawer: React.PropTypes.func,
    hasUnreadNotifications: React.PropTypes.number
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: F8Colors.bianca
  },
  headerWrapper: {
    android: {
      backgroundColor: 'transparent',
      borderRightWidth: 1,
      marginRight: -1,
      borderRightColor: 'transparent',
    }
  },

  listView: {
    flex: 1,
    backgroundColor: 'transparent'
  },
});

module.exports = ListContainer;
