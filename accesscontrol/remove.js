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

            var whoField;
            var whatField;

            //cannot leave both empty
            if (!node.who && !node.what){
                node.warn("Define at least one between role and resource.");
                return null;
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
                node.warn("Define only one between role and resource.");
                return null;
            }

            //cannot leave both empty
            if (!whoField && !whatField){
                node.warn("Define at least one between role and resource.");
                return null;
            }

            const ac = flowContext.get("accesscontrol");
            var err = false;

            //IF role is selected
            if(whoField){

                if (Array.isArray(whoField)){
                    whoField.forEach(function(element) {
                        
                        //check if the values are present
                        if(!ac.hasRole(element)){
                            node.warn("Role " + element+ " not found.");
                            err = true;
                        }
                    });

                    //if there was an error and force was not set, do not proceed with the removal
                    if(err == true && !node.force){
                        return null;
                    } else {
                        try{
                            ac.removeRoles(whoField);
                        } catch (e){
                            
                        }
                    }

                } else {

                    //check if the value is present
                    if(!ac.hasRole(whoField)){
                        node.warn("Role not found.");
                        return null;
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
                            err = true;
                        }
                    });

                    //if there was an error and force was not set, do not proceed with the removal
                    if(err == true && !node.force){
                        return null;
                    } else {
                        ac.removeResources(whatField);
                    }

                } else {

                    //check if the value is present
                    if(!ac.hasResource(whatField)){
                        node.warn("Resource not found.");
                        return null;
                    }

                    ac.removeResources(whatField);
                }
            }


            node.send(msg);
        });
    }
    RED.nodes.registerType("remove", RemoveNode);
}