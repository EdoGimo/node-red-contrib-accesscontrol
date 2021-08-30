module.exports = function(RED) {
    function PermissionsNode(config) {
        RED.nodes.createNode(this,config);

        //options
        this.who = config.who;
        this.whoType = config.whoType;
        this.what = config.what;
        this.whatType = config.whatType;

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

        //context selection (change ".flow" to ".global" for global context)
        var flowContext = this.context().flow;

        //MAIN code
        var node = this;
        node.on('input', function(msg) {

            if(!node.who || !node.what ){
                node.warn("Edit the configuration first!");
                return null;
            }

            if (!node.createAny && !node.createOwn && 
                !node.readAny   && !node.readOwn && 
                !node.updateAny && !node.updateOwn && 
                !node.deleteAny && !node.deleteOwn)
            {
                node.warn("Select at least one action!")  
                return null;  
            }

            const ac = flowContext.get("accesscontrol");

            //get the actual value of WHO and WHAT if msg was selected
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

            //check if there is an action selected (after converting msg)
            if(!node.createAny && !node.createOwn && 
                !node.readAny && !node.readOwn && 
                !node.updateAny && !node.updateOwn && 
                !node.deleteAny && !node.deleteOwn)
            {
                    node.warn("Check at least one action!");
                    return null;
            }

            var permissions = null;
            var proceed = true;

            if(node.createAny){
                permissions = ac.can(node.who).createAny(node.what);

                //if permission is false, avoid all the following IFs
                if(permissions.granted == false){
                    proceed = false;
                //else save the attributes
                }else{
                    msg.createAnyAttr = permissions.attributes;
                }
            }
            if(proceed && node.createOwn){
                permissions = ac.can(node.who).createOwn(node.what);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    msg.createOwnAttr = permissions.attributes;
                }
            }

            if(proceed && node.readAny){
                permissions = ac.can(node.who).readAny(node.what);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    msg.readAnyAttr = permissions.attributes;
                }
            }
            if(proceed && node.readOwn){
                permissions = ac.can(node.who).readOwn(node.what);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    msg.readOwnAttr = permissions.attributes;
                }
            }

            if(proceed && node.updateAny){
                permissions = ac.can(node.who).updateAny(node.what);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    msg.updateAnyAttr = permissions.attributes;
                }
            }
            if(proceed && node.updateOwn){
                permissions = ac.can(node.who).updateOwn(node.what);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    msg.updateOwnAttr = permissions.attributes;
                }
            }

            if(proceed && node.deleteAny){
                permissions = ac.can(node.who).deleteAny(node.what);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    msg.deleteAnyAttr = permissions.attributes;
                }
            }
            if(proceed && node.deleteOwn){
                permissions = ac.can(node.who).deleteOwn(node.what);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    msg.deleteOwnAttr = permissions.attributes;
                }
            }
           
            //output
            msg.payload = proceed;
            //msg.attributes = permissions.attributes; <-- magari salvarli in un altro campo di msg

            node.send(msg);
        });
    }
    RED.nodes.registerType("permissions", PermissionsNode);
}