module.exports = function (RED) {
    function GrantNode(config) {
        RED.nodes.createNode(this, config);

        //options
        this.who = config.who;
        this.whoType = config.whoType;

        //C
        this.createAny = config.createAny;
        this.createAnyType = config.createAnyType;
        this.createOwn = config.createOwn;
        this.createOwnType = config.createOwnType;
        //R
        this.readAny = config.readAny;
        this.readAnyType = config.readAnyType;
        this.readOwn = config.readOwn;
        this.readOwnType = config.readOwnType;
        //U
        this.updateAny = config.updateAny;
        this.updateAnyType = config.updateAnyType;
        this.updateOwn = config.updateOwn;
        this.updateOwnType = config.updateOwnType;
        //D
        this.deleteAny = config.deleteAny;
        this.deleteAnyType = config.deleteAnyType;
        this.deleteOwn = config.deleteOwn;
        this.deleteOwnType = config.deleteOwnType;

        //get attributes values
        this.create = config.create;
        this.createType = config.createType;

        this.read = config.read;
        this.readType = config.readType;

        this.update = config.update;
        this.updateType = config.updateType;

        this.delete = config.delete;
        this.deleteType = config.deleteType;

        this.what = config.what;
        this.whatType = config.whatType;


        //context selection (change ".flow" to ".global" for global context)
        var flowContext = this.context().flow;

        //MAIN code
        var node = this;
        node.on('input', function (msg) {

            try {

                var whoField;
                var whatField;

                //get the actual value of WHO and WHAT if msg was selected
                if (node.whoType == "msg") {
                    whoField = RED.util.getMessageProperty(msg, node.who);
                } else {
                    whoField = node.who;
                }
                if (node.whatType == "msg") {
                    whatField = RED.util.getMessageProperty(msg, node.what);
                } else {
                    whatField = node.what;
                }

                //check if WHO or WHAT are specified
                if (!whoField || !whatField) {
                    throw new Error("WHO or WHAT fields not specified. Ensure the msg attributes are not empty!");
                }

                //get the actual value of CRUD attributes
                var createAnyField = getValue(node.createAnyType, node.createAny, msg);
                var createOwnField = getValue(node.createOwnType, node.createOwn, msg);
                var readAnyField = getValue(node.readAnyType, node.readAny, msg);
                var readOwnField = getValue(node.readOwnType, node.readOwn, msg);
                var updateAnyField = getValue(node.updateAny, node.updateAny, msg);
                var updateOwnField = getValue(node.updateOwn, node.updateOwn, msg);
                var deleteAnyField = getValue(node.deleteAny, node.deleteAny, msg);
                var deleteOwnField = getValue(node.deleteOwn, node.deleteOwn, msg);


                //check if there is an action selected
                if (!createAnyField && !createOwnField &&
                    !readAnyField && !readOwnField &&
                    !updateAnyField && !updateOwnField &&
                    !deleteAnyField && !deleteOwnField) {
                    throw new Error("Check at least one action or check that the msg attributes are not empty!");
                }


                //variables initialized only if the array is in the msg
                var createField = null;
                var readField = null;
                var updateField = null;
                var deleteField = null;

                //CRUD attributes for msg (string inputs are handled differently)
                if (node.createType == "msg") {
                    createField = RED.util.getMessageProperty(msg, node.create);
                }
                if (node.readType == "msg") {
                    readField = RED.util.getMessageProperty(msg, node.read);
                }
                if (node.updateType == "msg") {
                    updateField = RED.util.getMessageProperty(msg, node.update);
                }
                if (node.deleteType == "msg") {
                    deleteField = RED.util.getMessageProperty(msg, node.delete);
                }


                //grant permissions
                const ac = flowContext.get("accesscontrol");

                if (!ac) {
                    throw new Error("AccessControl instance non-existent. Set it with 'AC init' first.");
                }


                //IF both the Any and Own are selected, Any is enough

                //=== CREATE ===
                //if attributes are specified AND the array is NOT in a msg
                if (node.create && !createField) {
                    if (createAnyField == true) {
                        ac.grant(whoField).createAny(whatField, node.create.split(",").map(item => item.trim()));
                    } else if (createOwnField == true) {
                        ac.grant(whoField).createOwn(whatField, node.create.split(",").map(item => item.trim()));
                    }
                    //if attributes are NOT specified OR the array is in a msg
                } else {
                    if (createAnyField == true) {
                        ac.grant(whoField).createAny(whatField, createField);  //second argument potentially null
                    } else if (createOwnField == true) {
                        ac.grant(whoField).createOwn(whatField, createField);  //second argument potentially null
                    }
                }

                //=== READ ===
                //if attributes are specified AND the array is NOT in a msg
                if (node.read && !readField) {
                    if (readAnyField == true) {
                        ac.grant(whoField).readAny(whatField, node.read.split(",").map(item => item.trim()));
                    } else if (readOwnField == true) {
                        ac.grant(whoField).readOwn(whatField, node.read.split(",").map(item => item.trim()));
                    }
                    //if attributes are NOT specified OR the array is in a msg
                } else {
                    if (readAnyField == true) {
                        ac.grant(whoField).readAny(whatField, readField);  //second argument potentially null
                    } else if (readOwnField == true) {
                        ac.grant(whoField).readOwn(whatField, readField);  //second argument potentially null
                    }
                }

                //=== UPDATE ===
                //if attributes are specified AND the array is NOT in a msg
                if (node.update && !updateField) {
                    if (updateAnyField == true) {
                        ac.grant(whoField).updateAny(whatField, node.update.split(",").map(item => item.trim()));
                    } else if (updateOwnField == true) {
                        ac.grant(whoField).updateOwn(whatField, node.update.split(",").map(item => item.trim()));
                    }
                    //if attributes are NOT specified OR the array is in a msg
                } else {
                    if (updateAnyField == true) {
                        ac.grant(whoField).updateAny(whatField, updateField);  //second argument potentially null
                    } else if (updateOwnField == true) {
                        ac.grant(whoField).updateOwn(whatField, updateField);  //second argument potentially null
                    }
                }

                //=== DELETE ===
                //if attributes are specified AND the array is NOT in a msg
                if (node.delete && !deleteField) {
                    if (deleteAnyField == true) {
                        ac.grant(whoField).deleteAny(whatField, node.delete.split(",").map(item => item.trim()));
                    } else if (deleteOwnField == true) {
                        ac.grant(whoField).deleteOwn(whatField, node.delete.split(",").map(item => item.trim()));
                    }
                    //if attributes are NOT specified OR the array is in a msg
                } else {
                    if (deleteAnyField == true) {
                        ac.grant(whoField).deleteAny(whatField, deleteField);  //second argument potentially null
                    } else if (deleteOwnField == true) {
                        ac.grant(whoField).deleteOwn(whatField, deleteField);  //second argument potentially null
                    }
                }


                node.send(msg);


            } catch (e) {
                node.error(e.message);
                return null;
            }
        });

        function getValue(type, action, msg){
            var result = false;

            //get the actual value of CRUD actions if is in msg + convert to boolean
            if (type == "msg") {
                result = RED.util.getMessageProperty(msg, action);
                if (typeof (ret) == "string") {
                    result = result === 'true';
                }

            //import as a boolean from the node otherwise
            } else {
                result = action === 'true';
            }

            return result;
        }
    }
    RED.nodes.registerType("grant", GrantNode);
}