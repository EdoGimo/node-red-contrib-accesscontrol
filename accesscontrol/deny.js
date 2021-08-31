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