# \<oe-message-handler\>

`<oe-message-handler>` is an element for handling message/warning/error display using `<paper-toast>`.
The component can be placed anywhere on the main application page and all message display will be handled
automatically.

```html
    <oe-message-handler duration="2000" persist-on="error"></oe-message-handler>
```

### Show a toast
* Within a polymer element

  ```js
  this.fire('oe-show-message','Hello World!');
  ```

* From javascript

  ```js
  var event = new CustomEvent('oe-show-message', {detail: "Hello World!"});
  window.dispatchEvent(event);
  ```

* For warning and error messages

  ```js
  this.fire('oe-show-warning','This is a warning message!');
  this.fire('oe-show-error','Oh snap! something went terribly wrong');
  ```

* Toast that stays forever

  ```js
  this.fire('oe-show-message',{
      message:'This message stays until the next toast',
      forever:true
  });
  ```

* Toasts to be explicitly dismissed

  When persist-on="error,warning" is provided, all error and warning messages will persist and OK button must be pressed to dismiss the toast. An ok callback can be provided which is invoked when user presses OK.

  ```js
  this.fire('oe-show-error', {
      message:'You must login before posting data.',
      ok: goToLoginPage
  });
  ```

### i18n
If passed in message object has a `code` property, it is transformed for i18n. This means, you can pass the error-codes/message-codes as `msgData.code` and `oe-message-handler` will translate them into current language. When a translation is not found, `msgData.message` is displayed (if present), otherwise `msgData.code` (i.e. the error-code/message-code) is displayed as it is.

```js
this.fire('oe-show-error', {
    code:'invalid-credentials',
    message: 'Invalid Credentials'
});
```

Now the `oe-message-handler` will look for a translation for 'invalid-credentials' and will display if it is found. If the
translation is not defined then 'Invalid Credentials' will be displayed.

### Confirmation window
Confirmation toast, takes ok and cancel callbacks.

```js
this.fire('oe-show-confirmation', {
    message:'Record will be permanently removed. Are you sure?',
    ok: okCallback,
    cancel:cancelCallback
});
```

### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--oe-message-success-background` | The background color of the success | `#78ab46`
`--oe-message-warning-background` | The background color of the warning | `#ffa000`
`--oe-message-error-background`   | The background color of the error   | `#d32f2f`

