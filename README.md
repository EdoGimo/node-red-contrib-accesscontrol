# node-red-contrib-accesscontrol

A [Node-RED](https://nodered.org/) implementation of the [accesscontrol](https://www.npmjs.com/package/accesscontrol) nmp module, offering Role Based and Attributed Based Access Control. Now supporting export/import to/from the [MongoDB node](https://flows.nodered.org/node/node-red-node-mongodb).


### Prerequisites

Node-RED installed. Tested on version 2.0.5.


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
There are (at the moment) 9 nodes:
- **AC set**: creates the AccessControl instance that contains all permissions (no database is used);
- **AC export**: export the AccessControl permissions as a string (JSON format);
- **AC import**: import the AccessControl permissions from a string (JSON format);
- **grant**: enables to grant to a role a CRUD action (Create, Read, Update, Delete) over a resource;
- **extend**: a quick way of granting to a role the same permissions of another role;
- **deny**: drops CRUD permissions previously set with grant/extend;
- **remove**: removes either role(s) or resource(s) from AccessControl;
- **permission**: checks if specific permissions are implemented or not.
- **permissions**: checks if multiple permissions are implemented or not.

Detailed information about each node can be read in the help tab of Node-RED.

Permission are defined by specification of 5 properties:
- role: the user or group of users receiving the authorization;
- resource: what the role can or cannot interact with;
- action: how the role can interact with the resource (CRUD actions);
- possession: specifies if the role can interact with the resource of 'any' other role or just with its 'own';
- attributes: optional values related to the resource, to provide a more accurate permission.


### Examples
[This flow](https://flows.nodered.org/flow/735d285b1e5fbf3f5c9f2495812c4292) shows a overly simplified use case scenario.

Also, [this flow](https://flows.nodered.org/flow/d9df53b07308813a6cb28511180351ed) shows how to combine this node with the MongoDB one.


### Contribution

Feel free to add more options or whatever may be of use.
