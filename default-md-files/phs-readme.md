# PHS Status Config

## Overview
PHS Status Config contains the rules used by the [Product Health System](https://paper.dropbox.com/doc/An-introduction-to-Product-Health-System--BUQ9sGfn~kw9fql5uQimUdFvAg-UZiTmV79GE37DNs8f27my). These rules are defined in the root [config](config) folder.<br />
These rules are defined by the product teams, **NOT** PHS.

![Image showing teams sending in source statuses to PHS and the structure of the config, that is used to evaluate feature statuses](https://broxy.tools.bbc.co.uk/morty-docs/phs-status-config/docs/user-guides/images/overview.drawio.svg)

## Status Dashboard
PHS uses a Grafana dashboard to display the status of iPlayer and Sounds at a given time (Subject to that feature being configured and events coming into the system).<br />
The [PHS Grafana Dashboard](https://dashboard.sre.tools.bbc.co.uk/d/guCZ2HM7z/phs?orgId=4&from=now-1h&to=now) can be found here

## Terminology
Before continuing it is important to understand the terminology used in PHS, see below for definitions:

### Source Status
A source status is the status of a service at a given time sent in by engineering teams that is stored in the Source
Statuses Store.<br />
These are in the engineering domain e.g. TAF Service Clegane but can express any level of granularity

### Feature Status
A feature status is an evaluated status based on the rules in its index.json file.<br />
These are in the product domain e.g. The Homepage of iPlayer on TV

## Getting Started
**⚠️ NOTE:** This repository is used for configuring feature statuses which depend on source statuses. If you have not already
set up your source statuses please refer to the [integration guide](docs/user-guides/integration-guide.md) and [how to name sources](docs/user-guides/naming-sources.md)

### How to
- [I want to create a new feature](#i-want-to-create-a-new-feature)
- [I want to provide additional source statuses to an existing feature](#i-want-to-provide-additional-source-statuses-to-an-existing-feature)
- [I want a feature status to depend on an existing feature status](#i-want-a-feature-status-to-depend-on-another-feature-status)
- [I want to test my feature works as expected](#i-want-to-test-my-feature-works-as-expected)

### I want to create a new feature
To create a feature status file you need to consider the following:
- Where does my service sit in the org and what other services depend upon my service?
- How does the status of your service impact other services or feature of the BBC? e.g. iPlayer
- Do you need to test your integration first or not?

Given the folder structure example below, I want to create a new feature status called `Platform B`.<br />
To do this you need to create a `Platform B ` folder and a `index.json` file, which conforms to
the [directory structure](#directory-structure).

**Directory Structure:**

![Image showing a new Feature file been added to the config](docs/user-guides/images/new-feature-directory-structure.drawio.svg)<br />
For more details see the [directory structure](#directory-structure) section in the [appendix](#appendix)

**File structure:**
``` diff
+{
+  "label": "Product A, Platform B",
+  "downWhen": [
+    {
+      "operator": "OR",
+      "rules": [
+        {
+          "id": "a-source-status-name",
+          "isSource": true,
+          "status": "DOWN"
+        }
+      ]
+    }
+  ]
+}
```
For more details see the [file structure](#file-structure) section in the [appendix](#appendix)

### I want to provide additional source statuses to an existing feature
When you have found a place where your source status should exist in the config, you will need to add a [source status rule](#feature-status-vs-source-event-status) in the `downWhen` and/or `degradedWhen` array blocks.

**Directory Structure:**

![Image showing a new source status been added to the config](docs/user-guides/images/append-source-status-to-existing-feature.drawio.svg)<br />
For more details see the [directory structure](#directory-structure) section in the [appendix](#appendix)

**File structure:**
``` diff
{
  "label": "Product A, Platform A",
  "downWhen": [
    {
      "operator": "OR",
      "rules": [
        {
          "id": "a-source-name",
          "isSource": true,
          "status": "DOWN"
        },
+       {
+         "id": "a-new-source-status-name",
+         "isSource": true,
+         "status": "DOWN"
+       }
      ]
    }
  ]
}
```
For more details see the [file structure](#file-structure) section in the [appendix](#appendix)

### I want a feature status to depend on another feature status
To reference another feature status in a feature status you will need to add a [feature status rule](#feature-status-vs-source-event-status).<br />
In the example diagram this would mean editing `product/product-a/index.json` if we had created a new folder called `platform-a/index.json`

**Directory Structure:**

This directory structure starts in the root [config](config) folder.

![Image showing a new Feature file been added to the config](docs/user-guides/images/reference-feature-in-existing-feature.drawio.svg)<br />
For more details see the [directory structure](#directory-structure) section in the [appendix](#appendix)

**File structure:**
``` diff
{
  "label": "Product A",
  "downWhen": [
    {
      "operator": "OR",
      "rules": [
        {
          "id": "a-service-name",
          "isSource": true,
          "status": "DOWN"
        },
+       {
+         "id": "platform/platform-a",
+         "isSource": false,
+         "status": "DOWN"
+       }
      ]
    }
  ]
}
```

For more details see the [file structure](#File-Structure-of-index.json) section in the [appendix](#appendix)

### I want to test my feature works as expected

The config is split into two environments so that you can use test alarm adaptors or check to ensure your new feature impacts the overall health of a product in the way you intend it to.

**⚠️ NOTE:** When copying & pasting test config please ensure that your live config references your live sources and live alarms.

Below shows the file structure for the environments

![Image showing the file structure to live and test products. Test is config/env/test and live is config/env/live](docs/user-guides/images/environment-config-file-structure.drawio.svg)

Once your PR has been successfully merged you can check your changes in [the Grafana dashboard](https://dashboard.sre.tools.bbc.co.uk/d/guCZ2HM7z/phs?orgId=4&from=now-1h&to=now).
You can then change the environment of the output by changing the `Change Environment` tab found at the top of the dashboard between `live` and `test` accordingly.

![Image showing the environment dropdown location at the top of the dashboard](docs/user-guides/images/grafana-change-environment.png)


## Appendix

### Directory structure

Feature files are always called index.json and are placed in a key/value pair folder structure. They can *only* be placed in the "value" folders i.e. every second one down the tree.

Please see below for how this looks:

![Image showing a new Feature file been added to the config](docs/user-guides/images/key-value-structure.drawio.svg)

For a fuller examples see the [GettingStarted...](#Getting-Started) section above.

#### Key/Value directory pairs

- key directory: Should be a generalised name so that other teams can use e.g. product, platform, feature.
  - these should be unique in a path e.g. `product/iplayer/platform/web/feature/playback/feature/uhd` is _not_ allowed because `feature` occurs twice as a key.
- value directory: Should be specific instances of the key e.g sounds, web, playback (for the keys: product, platform, feature).


### File Structure of index.json

The [JSON schema](src/validate/schema/phs-rules-schema.json) can be viewed for full details.

Simple example:

``` json
{
  "label": "Short name for this file",
  "downWhen": [
    {
      "operator": "AND/OR", // choose one.
      "rules": [ // operator only has an effect when there are multiple rules
        {
          "id": "my-unique-service-name",
          "isSource": true,
          "status": "UP/DEGRADED/DOWN" // choose one
        }
      ]
    }
  ]
}
```

The file structure is an object. The object properties you can use are:

Property Name | Type | Value | Details
--- | --- | --- | ---
label | required | string | Short name that describes the file
downWhen | required | array | array of objects, each object is a set of rules
degradedWhen | optional | array | array of objects, each object is a set of rules

For a downWhen or degradedWhen property each set of rules have the following properties:

Property Name | Type | Value | Details
--- | --- | --- | ---
operator | required | ENUM<br />[OR, AND] | `OR` means at least one rule must evaluate true. `AND` means all rules specified must evaluate true
rules | required | array | array of objects, each object is a rule to a source event status or feature status path

The rule object properties:

Property Name | Type | Value | Details
--- | --- | --- | ---
id | required | string | When isSource is `true` this is the source name you provided in the Cloudformation Alarm stack<br />When isSource is `false` this is the relative path to the feature status folder in the config
isSource | required | boolean | Set to `true` if you want to refer your rule to a source event status<br />Set to `false` if you want to link to a feature status<br />[See below for details](#feature-status-vs-source-event-status)
status | required | ENUM<br />[UP, DEGRADED, DOWN] | The status you want to compare against the actual status (from feature or source). <br />Also supports an array of these string values. <br />Use case: you have a relaxed downWhen that uses `AND` and you want to ensure that your degradedWhen is triggered for an actual `DOWN` or `DEGRADED`.

### Feature Status Rule vs Source Event Status Rule
*Source Event Status Rule*<br />
This rule should be added when you want to check the rule status value matches the latest status of your service.<br />
This can be either:
- From the `source` parameter provided in your [Alarm Adapter Cloudformation stack](docs/user-guides/alarm-adapter.md#steps).
- From the `source` in your detail object as part of your [direct implementation](docs/user-guides/record-source-event-direct-implementation.md#detail-object-breakdown).

The `id` field is where you add the name of your Source parameter<br />
Example:<br />
```json
{
  "id": "my-unique-service-name",
  "isSource": true,
  "status": "DOWN"
}
```

*Feature Status Rule*<br />
This rule should be added when you want to refer to a status generated from an index file that is in the same folder branch as this file.<br />
The `id` field is a relative path from this directory.<br />
Example:<br />
```json
{
  "id": "feature/statusLocation",
  "isSource": false,
  "status": "DOWN"
}
```
[Example structure](docs/example-config/parent/featureRules) can be found in the featureRules example config.

## Locally validating your config changes
Whilst your changes will be validated with PR checkers, you can validate your changes locally by running the following commands in the terminal

1. Install npm packages
```
npm ci
```

2. Run the validator
```
npm run validate-config
```