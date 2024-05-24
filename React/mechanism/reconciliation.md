# Reconciliation

## Target
* -> when using React, at a single point in time we can think of the **`render() function`** as **creating a tree of React elements**
* -> on the **`next state or props update`**, that _render() function_ will **return a different tree of React elements**

* => **`React`** then needs to **figure out how to efficiently update the UI to match the most recent tree**

## Solution
* _React implements a **`heuristic O(n) algorithm`** based on two assumptions:_
* -> **two elements of different types** will **`produce different trees`**
* -> the **developer can hint at which child elements** may be **`stable across different renders`** with a **key** prop

================================================================
# Diffing Algorithm
* -> When **`diffing two trees`**, React first **compares the two root elements**
* -> the behavior is different depending on the **types of the root elements**

## Elements Of Different Types

## DOM Elements Of The Same Type

