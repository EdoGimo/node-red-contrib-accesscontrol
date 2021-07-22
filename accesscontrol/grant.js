module.exports = function(RED) {
    function GrantNode(config) {
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

        this.update = config.update;

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


            //check if the who, update and what fields have a msg attribute
            let re = new RegExp('^msg.[a-zA-Z]+$');
            var upd = null;     //variable where to save the array in a msg attribute

            //get actual value
            if(re.test(node.who)){
                var x = eval(node.who);
                node.warn("Using "+ node.who +" value for WHO.");
                node.who = x;
            }
            if(re.test(node.update)){
                var x = eval(node.update);
                node.warn("Using "+ node.update +" value for UPDATE.");
                upd = x;
            }
            if(re.test(node.what)){
                var x = eval(node.what);
                node.warn("Using "+ node.what +" value for WHAT.");
                node.what = x;
            }
            

            //grant permissions

            //IF both the Any and Own are selected, Any is enough
            //C
            if (node.createAny){
                ac.grant(node.who).createAny(node.what);
            } else if (node.createOwn){
                ac.grant(node.who).createOwn(node.what);
            }
            //R
            if (node.readAny){
                ac.grant(node.who).readAny(node.what);
            } else if (node.readOwn){
                ac.grant(node.who).readOwn(node.what);
            }
            //U
            if (node.updateAny){

                //if update attributes are specified
                if(node.update){
                    //if the update is received as a string
                    if(!upd){
                        ac.grant(node.who).updateAny(node.what, node.update.split(",").map(item=>item.trim()) );
                    //if the update is received as an array
                    }else{
                        ac.grant(node.who).updateAny(node.what, upd);
                    }
                    
                }else{
                    ac.grant(node.who).updateAny(node.what);
                }

            } else if (node.updateOwn){
                //if update attributes are specified
                if(node.update){
                    //if the update is received as a string
                    if(!upd){
                        ac.grant(node.who).updateOwn(node.what, node.update.split(",").map(item=>item.trim()) );
                    //if the update is received as an array
                    }else{
                        ac.grant(node.who).updateAny(node.what, upd);
                    }
                    
                }else{
                    ac.grant(node.who).updateOwn(node.what);
                }
            }
            //D
            if (node.deleteAny){
                ac.grant(node.who).deleteAny(node.what);
            } else if (node.deleteOwn){
                ac.grant(node.who).deleteOwn(node.what);
            }
           

            //node.send(msg);
        });
    }
    RED.nodes.registerType("grant", GrantNode);
}