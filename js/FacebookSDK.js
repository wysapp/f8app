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
 * This module implements a part of Facebook JavaScript SDK
 * https://developers.facebook.com/docs/javascript/reference/v2.2
 *
 * @flow
 */
"use strict";

import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk";

const emptyFunction = () => {};

import mapObject from 'fbjs/lib/mapObject';

type AuthResponse = {
  userID: string,
  accessToken: string,
  expiresIn: number
};

type LoginOptions = { scope: string };
type loginCallback = (result: {
  authResponse?: AuthResponse,
  error?: Error
}) => void;

let _authResponse:? AuthResponse = null;

const FacebookSDK = {
  init() {
    // This need by Parse
    window.FB = FacebookSDK;
  }
};

module.exports = FacebookSDK;
