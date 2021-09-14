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
        this.create = config.create;
        this.createType = config.createType;
        //R
        this.readAny = config.readAny;
        this.readAnyType = config.readAnyType;
        this.readOwn = config.readOwn;
        this.readOwnType = config.readOwnType;
        this.read = config.read;
        this.readType = config.readType;
        //U
        this.updateAny = config.updateAny;
        this.updateAnyType = config.updateAnyType;
        this.updateOwn = config.updateOwn;
        this.updateOwnType = config.updateOwnType;
        this.update = config.update;
        this.updateType = config.updateType;
        //D
        this.deleteAny = config.deleteAny;
        this.deleteAnyType = config.deleteAnyType;
        this.deleteOwn = config.deleteOwn;
        this.deleteOwnType = config.deleteOwnType;
        this.delete = config.delete;
        this.deleteType = config.deleteType;

        //context selection (change ".flow" to ".global" for global context)
        var flowContext = this.context().flow;

        //MAIN code
        var node = this;
        node.on('input', function(msg) {

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
                node.warn("WHO or WHAT fields not specified. Check the msg attributes are not empty!");
                return null;
            }
            

            var createAnyField;
            var createOwnField;
            var createAttrField

            var readAnyField;
            var readOwnField;
            var readAttrField

            var updateAnyField;
            var updateOwnField;
            var updateAttrField

            var deleteAnyField;
            var deleteOwnField;
            var deleteAttrField

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
            if(node.createType == "msg"){
                createAttrField = RED.util.getMessageProperty(msg,node.create);
            }else{
                createAttrField = node.create;
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
            if(node.readType == "msg"){
                readAttrField = RED.util.getMessageProperty(msg,node.read);
            }else{
                readAttrField = node.read;
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
            if(node.updateType == "msg"){
                updateAttrField = RED.util.getMessageProperty(msg,node.udpate);
            }else{
                updateAttrField = node.update;
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
            if(node.deleteType == "msg"){
                deleteAttrField = RED.util.getMessageProperty(msg,node.delete);
            }else{
                deleteAttrField = node.delete;
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
            let checker = (arr, target) => target.every(v => arr.includes(v));

            if ( (ac.getRoles()).includes(whoField) == false){
                node.warn("The WHO role does not exist. Create it with the grant node before.");
                return null;
            }

            if ( (ac.getResources()).includes(whatField) == false){
                node.warn("The WHAT role does not exist. Create it with the grant node before.");
                return null;
            }

            if(createAnyField == true){
                permissions = ac.can(whoField).createAny(whatField);

                //if permission is false, avoid all the following IFs
                if(permissions.granted == false){
                    proceed = false;
                //else save the attributes
                }else{
                    //if the attributes are specified
                    if(createAttrField && createAttrField != ""){
                        proceed = checker(createAttrField, permissions.attributes);
                    }
                    //msg.createAnyAttr = permissions.attributes;
                }
            //TODO messo else con IF dopo perchè se è ANY freg di OWN
            } else if(createOwnField == true){
                permissions = ac.can(whoField).createOwn(whatField);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    //if the attributes are specified
                    if(createAttrField && createAttrField != ""){
                        proceed = checker(createAttrField, permissions.attributes);
                    }
                    //msg.createOwnAttr = permissions.attributes;
                }
            }

            if(proceed == true && readAnyField == true){
                permissions = ac.can(whoField).readAny(whatField);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    //if the attributes are specified
                    if(readAttrField && readAttrField != ""){
                        proceed = checker(readAttrField, permissions.attributes);
                    }
                    //msg.readAnyAttr = permissions.attributes;
                }
            }else if(proceed == true && readOwnField == true){
                permissions = ac.can(whoField).readOwn(whatField);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    //if the attributes are specified
                    if(readAttrField && readAttrField != ""){
                        proceed = checker(readAttrField, permissions.attributes);
                    }
                    //msg.readOwnAttr = permissions.attributes;
                }
            }

            if(proceed == true && updateAnyField == true){
                permissions = ac.can(whoField).updateAny(whatField);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    //if the attributes are specified
                    if(updateAttrField && updateAttrField != ""){
                        proceed = checker(updateAttrField, permissions.attributes);
                    }
                    //msg.updateAnyAttr = permissions.attributes;
                }
            }else if(proceed == true && updateOwnField == true){
                permissions = ac.can(whoField).updateOwn(whatField);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    //if the attributes are specified
                    if(updateAttrField && updateAttrField != ""){
                        proceed = checker(updateAttrField, permissions.attributes);
                    }
                    //msg.updateOwnAttr = permissions.attributes;
                }
            }

            if(proceed == true && deleteAnyField == true){
                permissions = ac.can(whoField).deleteAny(whatField);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    //if the attributes are specified
                    if(deleteAttrField && deleteAttrField != ""){
                        proceed = checker(deleteAttrField, permissions.attributes);
                    }
                    //msg.deleteAnyAttr = permissions.attributes;
                }
            }else if(proceed == true && deleteOwnField == true){
                permissions = ac.can(whoField).deleteOwn(whatField);
                if(permissions.granted == false){
                    proceed = false;
                }else{
                    //if the attributes are specified
                    if(deleteAttrField && deleteAttrField != ""){
                        proceed = checker(deleteAttrField, permissions.attributes);
                    }
                    //msg.deleteOwnAttr = permissions.attributes;
                }
            }
           
            //output
            msg.payload = proceed;

            
            node.send(msg);
        });
    }
    RED.nodes.registerType("permissions", PermissionsNode);
}