# node-red-contrib-accesscontrol

A [Node-RED](https://nodered.org/) implementation of the [accesscontrol](https://www.npmjs.com/package/accesscontrol) nmp module.


### Prerequisites

Node-RED installed. Tested on version 2.0.1.


### Installation
 
Install via Node-RED Manage Palette

```
node-red-contrib-accesscontrol
```

Install via npm

```shell
$ cd ~/.node-red
$ npm install node-red-contrib-accesscontrol
```

If necessary, restart Node-RED.


### How to use
There are at the moment 5 nodes:
- **AC set**: creates the AccessControl instance that contains all permissions (no database is used);
- **grant**: enables to grant to a role a CRUD action (Create, Read, Update, Delete) over a resource;
- **extend**: a quick way of granting to a role the same permissions of another role;
- **deny**: drops CRUD permissions previously set with grant/extend;
- **permission**: checks if specific permissions are implemented or not.

Detailed information about each node can be read in the help tab of Node-RED.



### Examples
[This flow](https://flows.nodered.org/flow/735d285b1e5fbf3f5c9f2495812c4292) shows a overly simplified use case scenario.


### Contribution

Feel free to add more options or whatever may be of use.

# WORK IN PROGRESS
This node is not completed yet.