module.exports = function(RED) {
    function RemoveNode(config) {
        RED.nodes.createNode(this,config);

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
        node.on('input', function(msg) {

            try{

                var whoField;
                var whatField;

                //cannot leave both empty
                if (!node.who && !node.what){
                    throw new Error("Define at least one between role and resource.");
                }

                //get the actual value of who and what if msg was selected
                if(node.whoType == "msg"){
                    whoField = RED.util.getMessageProperty(msg,node.who);

                }else if (node.who){
                    if( (node.who).includes(",")){
                        whoField = (node.who).split(",").map(item=>item.trim());
                    } else {
                        whoField = node.who;
                    }
                }

                if(node.whatType == "msg"){
                    whatField = RED.util.getMessageProperty(msg,node.what);
                    
                }else if (node.what){
                    if( (node.what).includes(",")){
                        whatField = (node.what).split(",").map(item=>item.trim());
                    } else {
                        whatField = node.what;
                    }
                }


                //cannot insert both role and resource
                if (whoField && whatField){
                    throw new Error("Define only one between role and resource.");
                }

                //cannot leave both empty
                if (!whoField && !whatField){
                    throw new Error("Define at least one between role and resource.");
                }

                const ac = flowContext.get("accesscontrol");

                if(!ac){
                    throw new Error("AccessControl instance non-existent. Set it with 'AC init' first.");
                }

                
                var missing = new Array();

                //IF role is selected
                if(whoField){

                    if (Array.isArray(whoField)){
                        whoField.forEach(function(element) {
                            
                            //check if the values are present
                            if(!ac.hasRole(element)){
                                node.warn("Role " + element+ " not found.");
                                missing.push(element);
                            }
                        });

                        //if there was a missing fole and force was not set, do not proceed with the removal
                        if(missing.length > 0 && !node.force){
                            return null;

                        } else if (missing.length > 0){
                            whoField = whoField.filter( ( el ) => !missing.includes( el ) );
                            
                            if(whoField.length > 0){
                                ac.removeRoles(whoField);
                            } else {
                                throw new Error("Nothing to remove.");
                            }

                        } else {
                            ac.removeRoles(whoField);
                        }

                    } else {

                        //check if the value is present
                        if(!ac.hasRole(whoField)){
                            throw new Error("Role not found.");
                        }

                        ac.removeRoles(whoField);
                    }
                }


                //IF resource is selected
                if(whatField){

                    if (Array.isArray(whatField)){
                        whatField.forEach(function(element) {
                            
                            //check if the values are present
                            if(!ac.hasResource(element)){
                                node.warn("Resource " + element + " not found.");
                                missing.push(element);
                            }
                        });

                        //if there was a missing resource and force was not set, do not proceed with the removal
                        if(missing.length > 0 && !node.force){
                            return null;

                        } else if (missing.length > 0){
                            whatField = whatField.filter( ( el ) => !missing.includes( el ) );

                            if(whatField.length > 0){
                                ac.removeResources(whatField);
                            } else {
                                throw new Error("Nothing to remove.");
                            }

                        } else {
                            ac.removeResources(whatField);
                        }

                    } else {

                        //check if the value is present
                        if(!ac.hasResource(whatField)){
                            throw new Error("Resource not found.");
                        }

                        ac.removeResources(whatField);
                    }
                }


                node.send(msg);


            }catch(e){
                node.warn(e.message);
                return null;
            }
        });
    }
    RED.nodes.registerType("remove", RemoveNode);
}