module.exports = function(RED) {
    function DenyNode(config) {
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
                createAnyField = createAnyField === 'true';
            //import as a boolean from the node otherwise
            }else{
                createAnyField = node.createAny === 'true';
            }
            if(node.createOwnType == "msg"){
                createOwnField = RED.util.getMessageProperty(msg,node.createOwn);
                createOwnField = createOwnField === 'true';
            }else{
                createOwnField = node.createOwn === 'true';
            }
            if(node.readAnyType == "msg"){
                readAnyField = RED.util.getMessageProperty(msg,node.readAny);
                readAnyField = readAnyField === 'true';
            }else{
                readAnyField = node.readAny === 'true';
            }
            if(node.readOwnType == "msg"){
                readOwnField = RED.util.getMessageProperty(msg,node.readOwn);
                readOwnField = readOwnField === 'true';
            }else{
                readOwnField = node.readOwn === 'true';
            }
            if(node.updateAnyType == "msg"){
                updateAnyField = RED.util.getMessageProperty(msg,node.updateAny);
                updateAnyField = updateAnyField === 'true';
            }else{
                updateAnyField = node.updateAny === 'true';
            }
            if(node.updateOwnType == "msg"){
                updateOwnField = RED.util.getMessageProperty(msg,node.updateOwn);
                updateOwnField = updateOwnField === 'true';
            }else{
                updateOwnField = node.updateOwn === 'true';
            }
            if(node.deleteAnyType == "msg"){
                deleteAnyField = RED.util.getMessageProperty(msg,node.deleteAny);
                deleteAnyField = deleteAnyField === 'true';
            }else{
                deleteAnyField = node.deleteAny === 'true';
            }
            if(node.deleteOwnType == "msg"){
                deleteOwnField = RED.util.getMessageProperty(msg,node.deleteOwn);
                deleteOwnField = deleteOwnField === 'true';
            }else{
                deleteOwnField = node.deleteOwn === 'true';
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
            

            //deny permissions
            const ac = flowContext.get("accesscontrol");
            //IF both the Any and Own are selected, Any is enough
            
            //=== CREATE ===
            if(createAnyField){
                ac.deny(whoField).createAny(whatField);
            } else if(createOwnField){
                ac.deny(whoField).createOwn(whatField);
            }
            
            //=== READ ===
            if(readAnyField){
                ac.deny(whoField).readAny(whatField);
            } else if(readOwnField){
                ac.deny(whoField).readOwn(whatField);
            }

            //=== UPDATE ===
            
            if(updateAnyField){
                ac.deny(whoField).updateAny(whatField);
            } else if(updateOwnField){
                ac.deny(whoField).updateOwn(whatField);
            }

            //=== DELETE ===
            
            if(deleteAnyField){
                ac.deny(whoField).deleteAny(whatField);
            } else if(deleteOwnField){
                ac.deny(whoField).deleteOwn(whatField);
            }
           

            node.send(msg);
        });
    }
    RED.nodes.registerType("deny", DenyNode);
}