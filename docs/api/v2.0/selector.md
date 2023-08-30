---
title: Selector
sidebarDepth: 2
---
## Properties

- ### `isSelector`

**Type:** Boolean

**Description:** enable selector

**Default:** `false`

- ### `checkSelectionCovered`

**Type:** Function

**ReturnType:** Boolean

**Description:** Additional judgment logic based on selected DOM elements.

**Default:**  If the return value of the method is not false, it defaults to true (including `undefined`).

- ### `containerId`

**Type:** String

**Description:** When there are multiple v-calendar tags, it is necessary to differentiate their unique indexes by customizing the containerId, in order to ensure that the target tag is correctly identified. 

**Default:** `month`
