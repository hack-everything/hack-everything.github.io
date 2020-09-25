function initializeSafariServices() {
    window.safari = window.safari || {};

    /**
     * Tabs
     */

    safari.tabs = {};

    /** Tab Actions */
    safari.tabs.create = createBridgeFunction('safari:tabs:action:create');
    safari.tabs.update = createBridgeFunction('safari:tabs:action:update', (args) => ({ tabId: args[0], ...args[1] }), (args) => args[2]);
    safari.tabs.get = createBridgeFunction('safari:tabs:action:get', (args) => ({ tabId: args[0] }));
    safari.tabs.sendMessage = createBridgeFunction('safari:tabs:action:sendMessage', (args) => ({ tabId: args[0], message: args[1] }), (args) => args[2]);
    safari.tabs.query = createBridgeFunction('safari:tabs:action:query');
    safari.tabs.remove = createBridgeFunction('safari:tabs:action:close', (args) => ({ tabId: args[0] }));

    /** Tab Events */
    safari.tabs.onAdded = {};
    safari.tabs.onAdded.addListener = createBridgeListener('safari:tabRegistry:event:added');
    safari.tabs.onRemoved = {};
    safari.tabs.onRemoved.addListener = createBridgeListener('safari:tabRegistry:event:removed');
    safari.tabs.onActivated = {};
    safari.tabs.onActivated.addListener = createBridgeListener('safari:tabRegistry:event:activated');
    safari.tabs.onNavigated = {};
    safari.tabs.onNavigated.addListener = createBridgeListener('safari:tabRegistry:event:navigated');

    /** Window Actions */
    safari.windows = {};
    safari.windows.create = createBridgeFunction('safari:windows:action:create');
    safari.windows.remove = createBridgeFunction('safari:windows:action:close', ([windowId]) => ({ windowId }));
    safari.windows.get = createBridgeFunction('safari:windows:action:get', ([windowId]) => ({ windowId }));
    safari.windows.query = createBridgeFunction('safari:windows:action:query');

    /**
     * Runtime
     */
    safari.runtime = {};

    /** Runtime Actions */
    safari.runtime.sendMessage = createBridgeFunction('safari:runtime:action:sendMessage');
    safari.runtime.reset = createBridgeFunction('safari:runtime:action:reset');
    safari.runtime.completeInstall = createBridgeFunction('safari:runtime:action:completeInstall');

    /** Runtime Events */
    safari.runtime.onMessage = {};
    safari.runtime.onMessage.addListener = createBridgeListener('safari:runtime:event:message', (message) => [message.data, message.sender]);
    safari.runtime.onMessage.removeListener = createBridgeListenerRemover('safari:runtime:event:message');
    safari.runtime.onInstalled = {};
    safari.runtime.onInstalled.addListener = createBridgeListener('safari:runtime:event:installed');
    safari.runtime.onStarted = {};
    safari.runtime.onStarted.addListener = createBridgeListener('safari:runtime:event:started');

    /**
     * Cookies
     */
    safari.cookies = {};

    /** Cookie Actions */
    safari.cookies.set = createBridgeFunction('safari:cookies:action:set');
    safari.cookies.get = createBridgeFunction('safari:cookies:action:get');
    safari.cookies.getAll = createBridgeFunction('safari:cookies:action:getAll');
    safari.cookies.remove = createBridgeFunction('safari:cookies:action:remove');

    safari.storage = {};

    /**
     * App Store
     */
    safari.appStore = {};
  
    /**
     * i18n
     */
    safari.i18n = {};
    let countryCode;
    let getCountryCodeAsync = createBridgeFunction('safari:I18n:action:getCountryCode');
    safari.i18n.getCountryCode = () => countryCode;
    safari.i18n.getUILanguage = () => {
      const includesCountryCode = !!navigator.language.match('-');
      if (includesCountryCode) { return navigator.language; }
      
      return `${navigator.language}-${countryCode}`;
    };
  
   /**
    * onReady script: This function loads data into the content script before
    * the content script is executed.
    *
    * @param cb - Callback function (ie. loading the extension's content script)
    */
    safari.onReady = (cb) => getCountryCodeAsync({}, (code) => {
      countryCode = code;
      cb();
    });

    /** App Store Actions */
    safari.appStore.requestReview = createBridgeFunction('safari:appStore:action:requestReview');

    ['sync', 'local', 'managed'].forEach(type => {
      const storage = safari.storage[type] = {};

      storage.get = createBridgeFunction(`safari:storage:action:${type}:get`, ([key]) => ({ key }));
      storage.set = createBridgeFunction(`safari:storage:action:${type}:set`, ([values]) => ({ values }));
      storage.remove = createBridgeFunction(`safari:storage:action:${type}:remove`, ([key]) => ({ key }));
      storage.clear = createBridgeFunction(`safari:storage:action:${type}:clear`);
      storage.getBytesInUse = createBridgeFunction(`safari:storage:action:${type}:getBytesInUse`, () => ({}), (args) => args[0]);
    });

    /**
     Extension
     */
    safari.browserAction = {};

    /** BrowserAction Actions */
    safari.browserAction.setBadgeText = createBridgeFunction('safari:browserAction:action:setBadgeText');
    safari.browserAction.resizePopover = createBridgeFunction('safari:browserAction:action:resizePopover');

    /** WebRequest Listeners */
    safari.webRequest = {};
    safari.webRequest.onBeforeRequest = {};
    safari.webRequest.onBeforeRequest.addListener = createBridgeListener('safari:webRequest:event:beforeRequest');

    safari.Request = class Request {
      constructor(method, url) {
        this.body = {};
        this.options = { headers: {} };
        this.method = method;
        this.url = url;
      }

      static get(url) {
        return new Request('GET', url);
      }

      static post(url) {
        return new Request('POST', url);
      }

      static put(url) {
        return new Request('PUT', url);
      }

      static patch(url) {
        return new Request('PATCH', url);
      }

      static delete(url) {
        return new Request('DELETE', url);
      }

      set(header, headerValue) {
        if (typeof header === 'string') {
          this.options.headers[header] = headerValue;
        } else {
          Object.assign(this.options.headers, header);
        }

        return this;
      }

      retry(retryCount) {
        this.options.retryCount = retryCount;

        return this;
      }

      query(params) {
        this.body = { ...this.body, ...params }

        return this;
      }

      then(success, failure) {
        return new Promise((resolve, reject) => {
          this.end((error, response) => {
            if (error) {
              return reject(error);
            } else {
              return resolve(response);
            }
          });
        }).then(success, failure);
      }

      catch(failure) {
        return new Promise((resolve, reject) => {
          this.end((error, response) => {
            if (error) {
              return reject(error);
            } else {
              return resolve(response);
            }
          });
        }).catch(failure);
      }

      send(body = {}) {
        this.body = body;

        return this;
      }

      abort() {
        this.aborted = true;

        return this;
      }

      end(callback) {
        if (this.sent) return;

        const { method, url, options, body } = this;

        options.headers['User-Agent'] = navigator.userAgent;

        safari.adapter.nativeCall('apiRequest', { method, url, options, body }, ({ status, error, headers, body, ok }) => {
          if (this.aborted) return;

          const normalizedHeaders = typeof header === 'string' ? JSON.parse(headers) : headers;
          let normalizedBody;
          try {
              normalizedBody = JSON.parse(body);
          } catch (e) {
              normalizedBody = body;
          }

          if (!error) {
            callback(null, { status, headers: normalizedHeaders, body: normalizedBody, text: body, ok });
          } else {
            callback({ status, error, response: { headers: normalizedHeaders, body: normalizedBody, text: body } });
          }
        });
      }
    }

    /**
     * Creates a function that calls the handler on the adapter for the current environment.
     *
     * @param name - The name of the native action to call
     * @param argGetter - Function that converts function arguments into a message payload
     * @param callbackGetter - Function that gets the callback from the function arguments.
     */
    function createBridgeFunction(name, argGetter = (args) => args[0] || ({}), callbackGetter = (args) => args[1]) {
      return function() {
        return safari.adapter.nativeCall(name, argGetter(arguments), (response) => {
          const callback = callbackGetter(arguments);

          if (response && response.error) {
            safari.runtime.lastError = new Error(response.error);
          } else {
            safari.runtime.lastError = null;
          }

          if (callback) {
            callback(response);
          }
        });
      }
    }

    /**
     * Creates a function to subscribe to the specified event name via the adapter for the current environment.
     *
     * @param name - The name of the event to subscribe to
     * @param argGetter - Formats the event payload into an array of arguments to send to the event callback.
     */
    function createBridgeListener(name, argGetter = (message) => [message]) {
      return function(listener) {
        const handler = (message, sendResponse) => listener.apply(null, argGetter(message).concat([sendResponse]));

        safari.adapter.nativeHandle(name, handler, listener);
      }
    }

    /**
     * Creates a function that removes existing event listeners.
     * @param name - The name of the event that the returned function should unsubscribe from.
     */
    function createBridgeListenerRemover(name) {
      return function(listener) {
        safari.adapter.nativeRemoveHandler(name, listener);
      };
    }
}

