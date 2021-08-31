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
                node.warn("WHO or WHAT fields not specified. Check the msg attributes are not empty!");
                return null;
            }

            //get the actual value of CRUD actions
            if(node.createAnyType == "msg"){
                createAnyField = RED.util.getMessageProperty(msg,node.createAny);
            }else{
                createAnyField = node.createAny;
            }
            if(node.createOwnType == "msg"){
                createOwnField = RED.util.getMessageProperty(msg,node.createOwn);
            }else{
                createOwnField = node.createOwn;
            }
            if(node.readAnyType == "msg"){
                readAnyField = RED.util.getMessageProperty(msg,node.readAny);
            }else{
                readAnyField = node.readAny;
            }
            if(node.readOwnType == "msg"){
                readOwnField = RED.util.getMessageProperty(msg,node.readOwn);
            }else{
                readOwnField = node.readOwn;
            }
            if(node.updateAnyType == "msg"){
                updateAnyField = RED.util.getMessageProperty(msg,node.updateAny);
            }else{
                updateAnyField = node.updateAny;
            }
            if(node.updateOwnType == "msg"){
                updateOwnField = RED.util.getMessageProperty(msg,node.updateOwn);
            }else{
                updateOwnField = node.updateOwn;
            }
            if(node.deleteAnyType == "msg"){
                deleteAnyField = RED.util.getMessageProperty(msg,node.deleteAny);
            }else{
                deleteAnyField = node.deleteAny;
            }
            if(node.deleteOwnType == "msg"){
                deleteOwnField = RED.util.getMessageProperty(msg,node.deleteOwn);
            }else{
                deleteOwnField = node.deleteOwn;
            }

            //CRUD attributes
            if(node.createType == "msg"){
                create_field = RED.util.getMessageProperty(msg,node.create);
            }
            if(node.readType == "msg"){
                read_field = RED.util.getMessageProperty(msg,node.read);
            }
            if(node.updateType == "msg"){
                update_field = RED.util.getMessageProperty(msg,node.update);
            }
            if(node.deleteType == "msg"){
                delete_field = RED.util.getMessageProperty(msg,node.delete);
            }
            
            //check if there is an action selected
            if (!createAnyField && !createOwnField && 
                !readAnyField   && !readOwnField && 
                !updateAnyField && !updateOwnField && 
                !deleteAnyField && !deleteOwnField)
            {
                    node.warn("Check at least one action or check that the msg attributes are not empty!");
                    return null;
            }


            //grant permissions
            const ac = flowContext.get("accesscontrol");
            //IF both the Any and Own are selected, Any is enough
            
            //=== CREATE ===
            //if attributes are specified AND the array is NOT in a msg
            if(node.create && !create_field){
                if(createAnyField){
                    ac.grant(whoField).createAny(whatField, node.create.split(",").map(item=>item.trim()) );
                } else if(createOwnField){
                    ac.grant(whoField).createOwn(whatField, node.create.split(",").map(item=>item.trim()) );
                }
            //if attributes are NOT specified OR the array is in a msg
            } else {
                if(createAnyField){
                    ac.grant(whoField).createAny(whatField, create_field);  //second argument potentially null
                } else if(createOwnField){
                    ac.grant(whoField).createOwn(whatField, create_field);  //second argument potentially null
                }
            }
            
            //=== READ ===
            //if attributes are specified AND the array is NOT in a msg
            if(node.read && !read_field){
                if(readAnyField){
                    ac.grant(whoField).readAny(whatField, node.read.split(",").map(item=>item.trim()) );
                } else if(readOwnField){
                    ac.grant(whoField).readOwn(whatField, node.read.split(",").map(item=>item.trim()) );
                }
            //if attributes are NOT specified OR the array is in a msg
            } else {
                if(readAnyField){
                    ac.grant(whoField).readAny(whatField, read_field);  //second argument potentially null
                } else if(readOwnField){
                    ac.grant(whoField).readOwn(whatField, read_field);  //second argument potentially null
                }
            }

            //=== UPDATE ===
            //if attributes are specified AND the array is NOT in a msg
            if(node.update && !update_field){
                if(updateAnyField){
                    ac.grant(whoField).updateAny(whatField, node.update.split(",").map(item=>item.trim()) );
                } else if(updateOwnField){
                    ac.grant(whoField).updateOwn(whatField, node.update.split(",").map(item=>item.trim()) );
                }
            //if attributes are NOT specified OR the array is in a msg
            } else {
                if(updateAnyField){
                    ac.grant(whoField).updateAny(whatField, update_field);  //second argument potentially null
                } else if(updateOwnField){
                    ac.grant(whoField).updateOwn(whatField, update_field);  //second argument potentially null
                }
            }

            //=== DELETE ===
            //if attributes are specified AND the array is NOT in a msg
            if(node.delete && !delete_field){
                if(deleteAnyField){
                    ac.grant(whoField).deleteAny(whatField, node.delete.split(",").map(item=>item.trim()) );
                } else if(deleteOwnField){
                    ac.grant(whoField).deleteOwn(whatField, node.delete.split(",").map(item=>item.trim()) );
                }
            //if attributes are NOT specified OR the array is in a msg
            } else {
                if(deleteAnyField){
                    ac.grant(whoField).deleteAny(whatField, delete_field);  //second argument potentially null
                } else if(deleteOwnField){
                    ac.grant(whoField).deleteOwn(whatField, delete_field);  //second argument potentially null
                }
            }
            

            node.send(msg);
        });
    }
    RED.nodes.registerType("grant", GrantNode);
}