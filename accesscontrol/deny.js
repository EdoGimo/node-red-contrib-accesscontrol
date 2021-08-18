module.exports = function(RED) {
    function DenyNode(config) {
        RED.nodes.createNode(this,config);

        //options
        this.who = config.who;
        this.whoType = config.whoType;

        //C
        this.createAny = config.createAny;
        this.createOwn = config.createOwn;
        //R
        this.readAny = config.readAny;
        this.readOwn = config.readOwn;
        //U
        this.updateAny = config.updateAny;
        this.updateOwn = config.updateOwn;
        //D
        this.deleteAny = config.deleteAny;
        this.deleteOwn = config.deleteOwn;

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
                !node.deleteAny && !node.deleteOwn){
                    node.warn("Check at least one action!");
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
            

            //deny permissions
            //IF both the Any and Own are selected, Any is enough
            
            //=== CREATE ===
            if(node.createAny){
                ac.deny(node.who).createAny(node.what);
            } else if(node.createOwn){
                ac.deny(node.who).createOwn(node.what);
            }
            
            //=== READ ===
            if(node.readAny){
                ac.deny(node.who).readAny(node.what);
            } else if(node.readOwn){
                ac.deny(node.who).readOwn(node.what);
            }

            //=== UPDATE ===
            
            if(node.updateAny){
                ac.deny(node.who).updateAny(node.what);
            } else if(node.updateOwn){
                ac.deny(node.who).updateOwn(node.what);
            }

            //=== DELETE ===
            
            if(node.deleteAny){
                ac.deny(node.who).deleteAny(node.what);
            } else if(node.deleteOwn){
                ac.deny(node.who).deleteOwn(node.what);
            }
           

            node.send(msg);
        });
    }
    RED.nodes.registerType("deny", DenyNode);
}