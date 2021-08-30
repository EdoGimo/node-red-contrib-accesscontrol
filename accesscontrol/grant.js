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

            //check if configuration was set
            if(!node.who || !node.what){
                node.warn("Edit the configuration first!");
                return null;
            }

            //check if there is an action selected
            if(!node.createAny && !node.createOwn && 
                !node.readAny && !node.readOwn && 
                !node.updateAny && !node.updateOwn && 
                !node.deleteAny && !node.deleteOwn)
            {
                    node.warn("Check at least one action!");
                    return null;
            }


            const ac = flowContext.get("accesscontrol");

            //get the actual value if msg was selected
            var create_field = null;
            var read_field = null;
            var update_field = null;     
            var delete_field = null;

            if(node.whoType == "msg"){
                node.who = RED.util.getMessageProperty(msg,node.who);
            }
            if(node.whatType == "msg"){
                node.what = RED.util.getMessageProperty(msg,node.what);
            }
            //CRUD
            if(node.createAnyType == "msg"){
                node.createAny = RED.util.getMessageProperty(msg,node.createAny);
            }
            if(node.createOwnType == "msg"){
                node.createOwn = RED.util.getMessageProperty(msg,node.createOwn);
            }
            if(node.readAnyType == "msg"){
                node.readAny = RED.util.getMessageProperty(msg,node.readAny);
            }
            if(node.readOwnType == "msg"){
                node.readOwn = RED.util.getMessageProperty(msg,node.readOwn);
            }
            if(node.updateAnyType == "msg"){
                node.updateAny = RED.util.getMessageProperty(msg,node.updateAny);
            }
            if(node.updateOwnType == "msg"){
                node.updateOwn = RED.util.getMessageProperty(msg,node.updateOwn);
            }
            if(node.deleteAnyType == "msg"){
                node.deleteAny = RED.util.getMessageProperty(msg,node.deleteAny);
            }
            if(node.deleteOwnType == "msg"){
                node.deleteOwn = RED.util.getMessageProperty(msg,node.deleteOwn);
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
            
            //check if there is an action selected (after converting msg)
            if(!node.createAny && !node.createOwn && 
                !node.readAny && !node.readOwn && 
                !node.updateAny && !node.updateOwn && 
                !node.deleteAny && !node.deleteOwn)
            {
                    node.warn("Check at least one action!");
            }

            //grant permissions
            //IF both the Any and Own are selected, Any is enough
            
            //=== CREATE ===
            //if attributes are specified AND the array is NOT in a msg
            if(node.create && !create_field){
                if(node.createAny){
                    ac.grant(node.who).createAny(node.what, node.create.split(",").map(item=>item.trim()) );
                } else if(node.createOwn){
                    ac.grant(node.who).createOwn(node.what, node.create.split(",").map(item=>item.trim()) );
                }
            //if attributes are NOT specified OR the array is in a msg
            } else {
                if(node.createAny){
                    ac.grant(node.who).createAny(node.what, create_field);  //second argument potentially null
                } else if(node.createOwn){
                    ac.grant(node.who).createOwn(node.what, create_field);  //second argument potentially null
                }
            }
            
            //=== READ ===
            //if attributes are specified AND the array is NOT in a msg
            if(node.read && !read_field){
                if(node.readAny){
                    ac.grant(node.who).readAny(node.what, node.read.split(",").map(item=>item.trim()) );
                } else if(node.readOwn){
                    ac.grant(node.who).readOwn(node.what, node.read.split(",").map(item=>item.trim()) );
                }
            //if attributes are NOT specified OR the array is in a msg
            } else {
                if(node.readAny){
                    ac.grant(node.who).readAny(node.what, read_field);  //second argument potentially null
                } else if(node.readOwn){
                    ac.grant(node.who).readOwn(node.what, read_field);  //second argument potentially null
                }
            }

            //=== UPDATE ===
            //if attributes are specified AND the array is NOT in a msg
            if(node.update && !update_field){
                if(node.updateAny){
                    ac.grant(node.who).updateAny(node.what, node.update.split(",").map(item=>item.trim()) );
                } else if(node.updateOwn){
                    ac.grant(node.who).updateOwn(node.what, node.update.split(",").map(item=>item.trim()) );
                }
            //if attributes are NOT specified OR the array is in a msg
            } else {
                if(node.updateAny){
                    ac.grant(node.who).updateAny(node.what, update_field);  //second argument potentially null
                } else if(node.updateOwn){
                    ac.grant(node.who).updateOwn(node.what, update_field);  //second argument potentially null
                }
            }

            //=== DELETE ===
            //if attributes are specified AND the array is NOT in a msg
            if(node.delete && !delete_field){
                if(node.deleteAny){
                    ac.grant(node.who).deleteAny(node.what, node.delete.split(",").map(item=>item.trim()) );
                } else if(node.deleteOwn){
                    ac.grant(node.who).deleteOwn(node.what, node.delete.split(",").map(item=>item.trim()) );
                }
            //if attributes are NOT specified OR the array is in a msg
            } else {
                if(node.deleteAny){
                    ac.grant(node.who).deleteAny(node.what, delete_field);  //second argument potentially null
                } else if(node.deleteOwn){
                    ac.grant(node.who).deleteOwn(node.what, delete_field);  //second argument potentially null
                }
            }
            

            node.send(msg);
        });
    }
    RED.nodes.registerType("grant", GrantNode);
}