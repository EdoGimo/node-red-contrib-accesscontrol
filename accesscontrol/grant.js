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

        //get attributes values
        this.create = config.create;
        this.read = config.read;
        this.update = config.update;
        this.delete = config.delete;

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
            var create_field = null;
            var read_field = null;
            var update_field = null;     
            var delete_field = null;

            //get actual value
            //WHO
            if(re.test(node.who)){
                var x = eval(node.who);
                node.warn("Using "+ node.who +" value for WHO.");
                node.who = x;
            }
            //CRUD
            if(re.test(node.create)){
                var x = eval(node.create);
                node.warn("Using "+ node.create +" value for CREATE.");
                create_field = x;
            }
            if(re.test(node.read)){
                var x = eval(node.read);
                node.warn("Using "+ node.read +" value for READ.");
                read_field = x;
            }
            if(re.test(node.update)){
                var x = eval(node.update);
                node.warn("Using "+ node.update +" value for UPDATE.");
                update_field = x;
            }
            if(re.test(node.delete)){
                var x = eval(node.delete);
                node.warn("Using "+ node.delete +" value for DELETE.");
                delete_field = x;
            }
            //WHAT
            if(re.test(node.what)){
                var x = eval(node.what);
                node.warn("Using "+ node.what +" value for WHAT.");
                node.what = x;
            }
            

            //grant permissions
            //IF both the Any and Own are selected, Any is enough
            
            //=== CREATE ===
            //if attributes were specified AND the array was NOT set
            if(node.create && !create_field){
                if(node.createAny){
                    ac.grant(node.who).createAny(node.what, node.create.split(",").map(item=>item.trim()) );
                } else if(node.createOwn){
                    ac.grant(node.who).createOwn(node.what, node.create.split(",").map(item=>item.trim()) );
                }
            //if attributes were NOT specified OR the array was set
            } else {
                if(node.createAny){
                    ac.grant(node.who).createAny(node.what, create_field);  //second argument potentially null
                } else if(node.createOwn){
                    ac.grant(node.who).createOwn(node.what, create_field);  //second argument potentially null
                }
            }
            
            //=== READ ===
            //if attributes were specified AND the array was NOT set
            if(node.read && !read_field){
                if(node.readAny){
                    ac.grant(node.who).readAny(node.what, node.read.split(",").map(item=>item.trim()) );
                } else if(node.readOwn){
                    ac.grant(node.who).readOwn(node.what, node.read.split(",").map(item=>item.trim()) );
                }
            //if attributes were NOT specified OR the array was set
            } else {
                if(node.readAny){
                    ac.grant(node.who).readAny(node.what, read_field);  //second argument potentially null
                } else if(node.readOwn){
                    ac.grant(node.who).readOwn(node.what, read_field);  //second argument potentially null
                }
            }

            //=== UPDATE ===
            //if attributes were specified AND the array was NOT set
            if(node.update && !update_field){
                if(node.updateAny){
                    ac.grant(node.who).updateAny(node.what, node.update.split(",").map(item=>item.trim()) );
                } else if(node.updateOwn){
                    ac.grant(node.who).updateOwn(node.what, node.update.split(",").map(item=>item.trim()) );
                }
            //if attributes were NOT specified OR the array was set
            } else {
                if(node.updateAny){
                    ac.grant(node.who).updateAny(node.what, update_field);  //second argument potentially null
                } else if(node.updateOwn){
                    ac.grant(node.who).updateOwn(node.what, update_field);  //second argument potentially null
                }
            }

            //=== DELETE ===
            //if attributes were specified AND the array was NOT set
            if(node.delete && !delete_field){
                if(node.deleteAny){
                    ac.grant(node.who).deleteAny(node.what, node.delete.split(",").map(item=>item.trim()) );
                } else if(node.deleteOwn){
                    ac.grant(node.who).deleteOwn(node.what, node.delete.split(",").map(item=>item.trim()) );
                }
            //if attributes were NOT specified OR the array was set
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