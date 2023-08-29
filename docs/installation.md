---
title: 'Installation'
---

:::tip
[Vue.js](https://vuejs.org) version 2.5+ is required.
:::

## NPM

### 1. Install via npm

```bash
npm install v-calendar
```

### 2. Import and use VCalendar
#### *2A. Plugin Method (Recommended)*

This is the most common use case.

```js
import Vue from 'vue';
import VCalendar from 'v-calendar-oxr';

// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
  componentPrefix: 'vc',  // Use <vc-calendar /> instead of <v-calendar />
  ...,                // ...other defaults
});

```

#### *2B. Components Method*

You can also just import components separately.

```js
import Calendar from 'v-calendar-oxr/lib/components/calendar.umd'
or
import { VCalendar } from 'v-calendar-oxr'

import DatePicker from 'v-calendar-oxr/lib/components/date-picker.umd'
or
import { VDatePicker } from 'v-calendar-oxr'

// Register components in your 'main.js'
Vue.component('calendar', Calendar)
Vue.component('calendar', VCalendar)
Vue.use(VCalendar)
Vue.component('date-picker', DatePicker)
Vue.component('date-picker', VDatePicker)
Vue.use(VDatePicker)

// Or just use in separate component
export default {
  components: {
    Calendar,
    VCalendar,
    DatePicker,
    VDatePicker
  }
  ...
}
```

If you would still like to provide [plugin defaults](../api/defaults.md), call `setupCalendar` before using any components.

```js
import { setupCalendar} from 'v-calendar-oxr'

// main.js
setupCalendar({
  componentPrefix: 'vc',
  ...,
});
```

## CDN
```html
<html>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
    <meta http-equiv='x-ua-compatible' content='ie=edge'>
    <!-- IMPORTANT: No CSS link needed as of v1 - It's all inlined -->
    <!-- Pre v1.0.0 versions need the minified css -->
    <!-- <link rel='stylesheet' href='https://unpkg.com/v-calendar/lib/v-calendar.min.css'> -->
  </head>
  <body>
    <div id='app'>
      <v-calendar></v-calendar>
      <v-date-picker v-model='selectedDate' />
    </div>

    <!-- 1. Link Vue Javascript -->
    <script src='https://unpkg.com/vue/dist/vue.js'></script>

    <!-- 2. Link VCalendar Javascript (Plugin automatically installed) -->
    <script src='https://unpkg.com/v-calendar'></script>

    <!--3. Create the Vue instance-->
    <script>
      new Vue({
        el: '#app',
        data: {
          selectedDate: null,
        }
      })
    </script>
  </body>
</html>
```
