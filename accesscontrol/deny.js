module.exports = function(RED) {
    function DenyNode(config) {
        RED.nodes.createNode(this,config);

        //options
        this.who = config.who;

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


            //check if some fields have a msg as an attribute
            let re = new RegExp('^msg.[a-zA-Z0-9]+$');

            //get actual value
            //WHO
            if(re.test(node.who)){
                var x = eval(node.who);
                node.warn("Using "+ node.who +" value for WHO.");
                node.who = x;
            }
            //WHAT
            if(re.test(node.what)){
                var x = eval(node.what);
                node.warn("Using "+ node.what +" value for WHAT.");
                node.what = x;
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
           

            //node.send(msg);
        });
    }
    RED.nodes.registerType("deny", DenyNode);
}