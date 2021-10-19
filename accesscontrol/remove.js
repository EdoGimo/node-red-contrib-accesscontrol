module.exports = function (RED) {
    function RemoveNode(config) {
        RED.nodes.createNode(this, config);

        //options
        this.who = config.who;      //Role
        this.whoType = config.whoType;
        this.what = config.what;    //Resource
        this.whatType = config.whatType;
        this.force = config.force;


        //context selection (change ".flow" to ".global" for global context)
        var flowContext = this.context().flow;

        //MAIN code
        var node = this;
        node.on('input', function (msg) {

            try {

                //cannot leave both empty
                if (!node.who && !node.what) {
                    throw new Error("Define at least one between role and resource.");
                }

                var whoField = splitArray(node.who, node.whoType, msg);
                
                var whatField = splitArray(node.what, node.whatType, msg);


                //cannot insert both role and resource
                if (whoField && whatField) {
                    throw new Error("Define only one between role and resource.");
                }

                //cannot leave both empty
                if (!whoField && !whatField) {
                    throw new Error("Define at least one between role and resource.");
                }

                const ac = flowContext.get("accesscontrol");

                if (!ac) {
                    throw new Error("AccessControl instance non-existent. Set it with 'AC init' first.");
                }


                var missing = new Array();

                //IF role is selected
                if (whoField) {

                    if (Array.isArray(whoField)) {
                        whoField.forEach(function (element) {

                            //check if the values are present
                            if (!ac.hasRole(element)) {

                                node.warn("Role " + element + " not found.");
                                missing.push(element);
                            }
                        });

                        //if there was a missing fole and force was not set, do not proceed with the removal
                        if (missing.length > 0 && !node.force) {
                            throw new Error("Removal interrupted for missing role(s).");

                        } else if (missing.length > 0) {
                            whoField = whoField.filter((el) => !missing.includes(el));

                            if (whoField.length > 0) {
                                ac.removeRoles(whoField);
                            } else {
                                throw new Error("Nothing to remove.");
                            }

                        } else {
                            ac.removeRoles(whoField);
                        }

                        //check if the values have been removed
                        if (ac.hasRole(whoField)) {
                            throw new Error("Roles were unexpectedly not removed.");
                        }

                    } else {

                        //check if the value is present
                        if (!ac.hasRole(whoField)) {
                            throw new Error("Role not found.");
                        }

                        ac.removeRoles(whoField);

                        //check if the value has been removed
                        if (ac.hasRole(whoField)) {
                            throw new Error("Role was unexpectedly not removed.");
                        }
                    }
                }


                //IF resource is selected
                if (whatField) {

                    if (Array.isArray(whatField)) {
                        whatField.forEach(function (element) {

                            //check if the values are present
                            if (!ac.hasResource(element)) {

                                node.warn("Resource " + element + " not found.");
                                missing.push(element);
                            }
                        });

                        //if there was a missing resource and force was not set, do not proceed with the removal
                        if (missing.length > 0 && !node.force) {
                            throw new Error("Removal interrupted for missing resource(s).");

                        } else if (missing.length > 0) {
                            whatField = whatField.filter((el) => !missing.includes(el));

                            if (whatField.length > 0) {
                                ac.removeResources(whatField);
                            } else {
                                throw new Error("Nothing to remove.");
                            }

                        } else {
                            ac.removeResources(whatField);
                        }

                        //check if the values have been removed
                        if (ac.hasResource(whatField)) {
                            throw new Error("Resources were unexpectedly not removed.");
                        }

                    } else {

                        //check if the value is present
                        if (!ac.hasResource(whatField)) {
                            throw new Error("Resource not found.");
                        }

                        ac.removeResources(whatField);

                        //check if the value has been removed
                        if (ac.hasResource(whatField)) {
                            throw new Error("Resource was unexpectedly not removed.");
                        }
                    }
                }

                node.send(msg);


            } catch (e) {
                node.error(e.message);
                return null;
            }
        });


        function splitArray(value, type, msg){

            //characters not accepted
            const notAccepted = ['&','<','>','"',"'","/","`"];

            //get the actual value of who and what if msg was selected
            if (type == "msg") {
                //filter removes empty fields
                return RED.util.getMessageProperty(msg, value).filter(a=> a);

            //get the actual value of who and what if msg was NOT selected
            } else if (value) {

                notAccepted.forEach(element => {
                    if ((value).includes(element)){
                        throw new Error("Improper characters used. See the documentation.");
                    }
                });
                
                if ((value).includes(",")) {
                    //split by comma, map each value to an array field, filter out empty fields
                    return (value).split(",").map(item => item.trim()).filter(a=> a);
                } else {
                    return value;
                }

            //the current property (who or what) is not selected
            } else {
                return null;
            }
        }
    }
    RED.nodes.registerType("remove", RemoveNode);
}