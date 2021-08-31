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

            //check if there is an action selected
            if (!createAnyField && !createOwnField && 
                !readAnyField   && !readOwnField && 
                !updateAnyField && !updateOwnField && 
                !deleteAnyField && !deleteOwnField)
            {
                node.warn("No CRUD action specified. Check at least one (or that msg attributes are not all empty)!");
                return null;
            }


            const ac = flowContext.get("accesscontrol");

            var permissions = null;
            var proceed = true;

            if (! (ac.getRoles()).includes(whoField)){
                node.warn("The WHO role does not exist. Create it with the grant node before.");
                return null;
            }

            if (! (ac.getResources()).includes(whatField)){
                node.warn("The WHAT role does not exist. Create it with the grant node before.");
                return null;
            }

            if(createAnyField){
                permissions = ac.can(whoField).createAny(whatField);

                //if permission is false, avoid all the following IFs
                if(permissions.granted == false){
                    proceed = false;
                //else save the attributes
                }else{
                    msg.createAnyAttr = permissions.attributes;
                }
            }
            if(proceed && createOwnField){
                permissions = ac.can(whoField).createOwn(whatField);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    msg.createOwnAttr = permissions.attributes;
                }
            }

            if(proceed && readAnyField){
                permissions = ac.can(whoField).readAny(whatField);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    msg.readAnyAttr = permissions.attributes;
                }
            }
            if(proceed && readOwnField){
                permissions = ac.can(whoField).readOwn(whatField);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    msg.readOwnAttr = permissions.attributes;
                }
            }

            if(proceed && updateAnyField){
                permissions = ac.can(whoField).updateAny(whatField);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    msg.updateAnyAttr = permissions.attributes;
                }
            }
            if(proceed && updateOwnField){
                permissions = ac.can(whoField).updateOwn(whatField);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    msg.updateOwnAttr = permissions.attributes;
                }
            }

            if(proceed && deleteAnyField){
                permissions = ac.can(whoField).deleteAny(whatField);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    msg.deleteAnyAttr = permissions.attributes;
                }
            }
            if(proceed && deleteOwnField){
                permissions = ac.can(whoField).deleteOwn(whatField);
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