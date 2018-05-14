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
import { Dimensions, Platform, View, Text } from "react-native";
import { Navigator } from "react-native-deprecated-custom-components";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import ListContainer from '../../common/ListContainer';
import ScheduleListView from './ScheduleListView';

import FilterSessions from './filterSessions';
import { sessionsHappeningToday } from "../../common/convertTimes";

import type { Session } from "../../reducers/sessions";

const data = createSelector(
  store => store.sessions,
  store => store.scheduleFilter,
  (sessions, filter) => {return FilterSessions.byTopics(sessions, filter)}
);

const GANTT_PADDING_H = 14,
      GANTT_WIDTH = Dimensions.get("window").width - GANTT_PADDING_H * 2;


type Props = {
  filter: any,
  day: number,
  sessions: Array<Session>,
  navigator: Navigator,
  logOut: () => void,
  switchDay: (day: number) => void
};

class GeneralScheduleView extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      hideCompleted: false,
      filterModal: false,
      sessionsHappeningToday: sessionsHappeningToday(props.now),
      incompleteSessions: FilterSessions.byCompleted(props.sessions, props.now)
    };
  }

  render() {

    let sessions = [...this.props.sessions];
    if (this.state.hideCompleted && this.state.sessionsHappeningToday) {
      sessions = [...this.state.incompleteSessions];
    }

    const content = (
      <ListContainer
        title="Schedule"
        selectedSegment={this.props.day - 1}
      >
        <ScheduleListView
          title="Day 1"
          day={1}
          sessions={sessions}
        />
        <ScheduleListView
          title="Day 2"
          day={2}
          sessions={sessions}
        />
      </ListContainer>
    );

    if (Platform.OS === 'ios') {
      return content;
    } else {
      return (
        <View style={{flex: 1}}>
          {content}
        </View>
      )
    }
  }
}

function select(store) {
  return {
    day: store.navigation.day,
    filter: store.scheduleFilter,
    topics: store.scheduleTopics,
    sessions: data(store)
  };
}

module.exports = connect(select)(GeneralScheduleView);
