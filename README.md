## catch-global-error ( web )

devtools([vConsole](https://github.com/Tencent/vConsole))、upload error、monitoring logs

## Use

```bash
npm install catch-global-error --save
// or
yarn add catch-global-error
```

```js
import CatchError from 'catch-global-error';

const catchError = new CatchError();
catchError.init({
  url: '/api/error/log', // upload error site
});
const a = 1;
console.log(a.b.c);
```

## Method

### init([config])

initialize

options parameter

| param | description | type | value | default value |
| --- | --- | --- | --- | --- |
| url | the site of uploading error | String | - | - |
| method | the method of uploading error | String | get/post | post |
| showDevtools | show devtools | Boolean | true/false | false |
| urlSwitch | url query for devtools | Object | - | { devtools: 'show' } |
| cdn | vConsole cdn | String | - | 'https://res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js' |
| extendFields | add extend field about business or project what you want to send to the service, such as business_line, type | Object | - | - |



### show()

show devtools


## Demo of devtools

### 1. ```showDevtools = true```
```js
// 1: init
import CatchError from 'catch-global-error';
const catchError = new CatchError();
catchError.init({
  showDevtools: true, // default show Devtools
});
```

### 2. url query

```js
// default: www.***.com?devtools=show
// you can change url query switch

// eq: www.***.com?show=test
import CatchError from 'catch-global-error';
const catchError = new CatchError();
catchError.init({
  urlSwitch: {
    show: 'test',
  },
});
```

### 3. catchError.show

```js
import CatchError from 'catch-global-error';
const catchError = new CatchError();
catchError.init();

window.onclick = () => {
  catchError.show();
};
```

## LICENSE

MIT
