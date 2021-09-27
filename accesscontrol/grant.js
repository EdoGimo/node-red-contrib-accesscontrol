module.exports = function(RED) {
    function GrantNode(config) {
        RED.nodes.createNode(this,config);

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
        node.on('input', function(msg) {

            try{

                var whoField;
                var whatField;

                //get the actual value of WHO and WHAT if msg was selected
                if(node.whoType == "msg"){
                    whoField = RED.util.getMessageProperty(msg,node.who);
                }else{
                    whoField = node.who;
                }
                if(node.whatType == "msg"){
                    whatField = RED.util.getMessageProperty(msg,node.what);
                }else{
                    whatField = node.what;
                }

                //check if WHO or WHAT are specified
                if(!whoField || !whatField ){
                    throw new Error("WHO or WHAT fields not specified. Check the msg attributes are not empty!");
                }

                var createAnyField;
                var createOwnField;
                var readAnyField;
                var readOwnField;
                var updateAnyField;
                var updateOwnField;
                var deleteAnyField;
                var deleteOwnField;

                //get the actual value of CRUD actions if is in msg + convert to boolean
                if(node.createAnyType == "msg"){
                    createAnyField = RED.util.getMessageProperty(msg,node.createAny);
                    if (typeof(createAnyField) == "string"){
                        createAnyField = createAnyField === 'true';
                    }
                //import as a boolean from the node otherwise
                }else{
                    createAnyField = node.createAny === 'true';
                }
                if(node.createOwnType == "msg"){
                    createOwnField = RED.util.getMessageProperty(msg,node.createOwn);
                    if (typeof(createOwnField) == "string"){
                        createOwnField = createOwnField === 'true';
                    }
                }else{
                    createOwnField = node.createOwn === 'true';
                }
                if(node.readAnyType == "msg"){
                    readAnyField = RED.util.getMessageProperty(msg,node.readAny);
                    if (typeof(readAnyField) == "string"){
                        readAnyField = readAnyField === 'true';
                    }
                }else{
                    readAnyField = node.readAny === 'true';
                }
                if(node.readOwnType == "msg"){
                    readOwnField = RED.util.getMessageProperty(msg,node.readOwn);
                    if (typeof(readOwnField) == "string"){
                        readOwnField = readOwnField === 'true';
                    }
                }else{
                    readOwnField = node.readOwn === 'true';
                }
                if(node.updateAnyType == "msg"){
                    updateAnyField = RED.util.getMessageProperty(msg,node.updateAny);
                    if (typeof(updateAnyField) == "string"){
                        updateAnyField = updateAnyField === 'true';
                    }
                }else{
                    updateAnyField = node.updateAny === 'true';
                }
                if(node.updateOwnType == "msg"){
                    updateOwnField = RED.util.getMessageProperty(msg,node.updateOwn);
                    if (typeof(updateOwnField) == "string"){
                        updateOwnField = updateOwnField === 'true';
                    }
                }else{
                    updateOwnField = node.updateOwn === 'true';
                }
                if(node.deleteAnyType == "msg"){
                    deleteAnyField = RED.util.getMessageProperty(msg,node.deleteAny);
                    if (typeof(deleteAnyField) == "string"){
                        deleteAnyField = deleteAnyField === 'true';
                    }
                }else{
                    deleteAnyField = node.deleteAny === 'true';
                }
                if(node.deleteOwnType == "msg"){
                    deleteOwnField = RED.util.getMessageProperty(msg,node.deleteOwn);
                    if (typeof(deleteOwnField) == "string"){
                        deleteOwnField = deleteOwnField === 'true';
                    }
                }else{
                    deleteOwnField = node.deleteOwn === 'true';
                }

                //check if there is an action selected
                if (!createAnyField && !createOwnField && 
                    !readAnyField   && !readOwnField && 
                    !updateAnyField && !updateOwnField && 
                    !deleteAnyField && !deleteOwnField )
                {
                    throw new Error("Check at least one action or check that the msg attributes are not empty!");
                }


                //variables initialized only if the array is in the msg
                var createField = null;
                var readField = null;
                var updateField = null;
                var deleteField = null;

                //CRUD attributes
                if(node.createType == "msg"){
                    createField = RED.util.getMessageProperty(msg,node.create);
                }
                if(node.readType == "msg"){
                    readField = RED.util.getMessageProperty(msg,node.read);
                }
                if(node.updateType == "msg"){
                    updateField = RED.util.getMessageProperty(msg,node.update);
                }
                if(node.deleteType == "msg"){
                    deleteField = RED.util.getMessageProperty(msg,node.delete);
                }


                //grant permissions
                const ac = flowContext.get("accesscontrol");

                if(!ac){
                    throw new Error("AccessControl instance non-existent. Set it with 'AC init' first.");
                }

                
                //IF both the Any and Own are selected, Any is enough
                
                //=== CREATE ===
                //if attributes are specified AND the array is NOT in a msg
                if(node.create && !createField){
                    if(createAnyField == true){
                        ac.grant(whoField).createAny(whatField, node.create.split(",").map(item=>item.trim()) );
                    } else if(createOwnField == true){
                        ac.grant(whoField).createOwn(whatField, node.create.split(",").map(item=>item.trim()) );
                    }
                //if attributes are NOT specified OR the array is in a msg
                } else {
                    if(createAnyField == true){
                        ac.grant(whoField).createAny(whatField, createField);  //second argument potentially null
                    } else if(createOwnField == true){
                        ac.grant(whoField).createOwn(whatField, createField);  //second argument potentially null
                    }
                }
                
                //=== READ ===
                //if attributes are specified AND the array is NOT in a msg
                if(node.read && !readField){
                    if(readAnyField == true){
                        ac.grant(whoField).readAny(whatField, node.read.split(",").map(item=>item.trim()) );
                    } else if(readOwnField == true){
                        ac.grant(whoField).readOwn(whatField, node.read.split(",").map(item=>item.trim()) );
                    }
                //if attributes are NOT specified OR the array is in a msg
                } else {
                    if(readAnyField == true){
                        ac.grant(whoField).readAny(whatField, readField);  //second argument potentially null
                    } else if(readOwnField == true){
                        ac.grant(whoField).readOwn(whatField, readField);  //second argument potentially null
                    }
                }

                //=== UPDATE ===
                //if attributes are specified AND the array is NOT in a msg
                if(node.update && !updateField){
                    if(updateAnyField == true){
                        ac.grant(whoField).updateAny(whatField, node.update.split(",").map(item=>item.trim()) );
                    } else if(updateOwnField == true){
                        ac.grant(whoField).updateOwn(whatField, node.update.split(",").map(item=>item.trim()) );
                    }
                //if attributes are NOT specified OR the array is in a msg
                } else {
                    if(updateAnyField == true){
                        ac.grant(whoField).updateAny(whatField, updateField);  //second argument potentially null
                    } else if(updateOwnField == true){
                        ac.grant(whoField).updateOwn(whatField, updateField);  //second argument potentially null
                    }
                }

                //=== DELETE ===
                //if attributes are specified AND the array is NOT in a msg
                if(node.delete && !deleteField){
                    if(deleteAnyField == true){
                        ac.grant(whoField).deleteAny(whatField, node.delete.split(",").map(item=>item.trim()) );
                    } else if(deleteOwnField == true){
                        ac.grant(whoField).deleteOwn(whatField, node.delete.split(",").map(item=>item.trim()) );
                    }
                //if attributes are NOT specified OR the array is in a msg
                } else {
                    if(deleteAnyField == true){
                        ac.grant(whoField).deleteAny(whatField, deleteField);  //second argument potentially null
                    } else if(deleteOwnField == true){
                        ac.grant(whoField).deleteOwn(whatField, deleteField);  //second argument potentially null
                    }
                }
                

                node.send(msg);


            }catch(e){
                node.warn(e.message);
                return null;
            }
        });
    }
    RED.nodes.registerType("grant", GrantNode);
}