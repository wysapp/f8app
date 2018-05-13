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

async function loginWithFacebookSDK(options: LoginOptions): Promise<AuthResponse> {
  const scope = options.scope || "public_profile";
  const permissions = scope.split(',');
  
  const loginResult = {}; // await LoginManager.logInWithReadPermissions(permissions);
  if (loginResult.isCancelled) {
    throw new Error("Canceled by user");
  }

  // const accessToken = await AccessToken.getCurrentAccessToken();
  const accessToken = {
    userID: '111111',
    accessToken: '111111',
    expirationTime: '1526198555532'
  };

  if (!accessToken) {
    throw new Error("No access token");
  }

  _authResponse = {
    userID: accessToken.userID,
    accessToken: accessToken.accessToken,
    expiresIn: Math.round((accessToken.expirationTime - Date.now()) / 1000)
  };

  return _authResponse;
}

const FacebookSDK = {
  init() {
    // This need by Parse
    window.FB = FacebookSDK;
  },

  login(callback: LoginCallback, options: LoginOptions) {
    loginWithFacebookSDK(options).then(
      authResponse => callback({authResponse}),
      error => callback({ error })
    );
  },

  getAuthResponse(): ?AuthResponse {
    return _authResponse;
  },

  logout() {
    LoginManager.logOut();
  },

  api: function(path: string, ...args: Array<mixed>) {
    const argByType = {};
    args.forEach(arg => {
      argByType[typeof arg] = arg;
    });

    const httpMethod = (argByType.string || 'get').toUpperCase();
    const params = argByType.object || {};
    const callback = argByType.function || emptyFunction;

    const parameters = mapObject(params, value => ({string: value}));

    function processResponse(error, result) {
      if (!error && typeof result === 'string') {
        try {
          result = JSON.parse(result);
        } catch(e) {
          error = e;
        }
      }

      const data = error ? { error } : result;
      callback(data);
    }

    const request = new GraphRequest(
      path,
      { parameters, httpMethod},
      processResponse
    );
    new GraphRequestManager().addRequest(request).start();
  }
};

module.exports = FacebookSDK;
