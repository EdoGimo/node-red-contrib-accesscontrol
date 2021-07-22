module.exports = function(RED) {
    function PermissionNode(config) {
        RED.nodes.createNode(this,config);

        //options
        this.who = config.who;
        this.crud = config.crud;
        this.any = config.any;
        this.what = config.what;

        //context selection (change ".flow" to ".global" for global context)
        var flowContext = this.context().flow;

        //MAIN code
        var node = this;
        node.on('input', function(msg) {

            if(!node.who || !node.crud || !node.what ){
                node.warn("Edit the configuration first!");
                return null;
            }
            const ac = flowContext.get("accesscontrol");

            //check if the who and what fields have a msg attribute
            let re = new RegExp('^msg.[a-zA-Z]+$');

            //get actual value
            if(re.test(node.who)){
                var x = eval(node.who);
                node.warn("Using "+ node.who +" value for WHO.");
                node.who = x;
            }
            if(re.test(node.what)){
                var x = eval(node.what);
                node.warn("Using "+ node.what +" value for WHAT.");
                node.what = x;
            }


            var permission = null;

            switch(node.crud){
                //CREATE
                case "create":
                    if(node.any){
                        permission = ac.can(node.who).createAny(node.what);
                    }else{
                        permission = ac.can(node.who).createOwn(node.what);
                    }
                    break;
                
                //READ
                case "read":
                    if(node.any){
                        permission = ac.can(node.who).readAny(node.what);
                    }else{
                        permission = ac.can(node.who).readOwn(node.what);
                    }
                    break;
                
                //UPDATE
                case "update":
                    if(node.any){
                        permission = ac.can(node.who).updateAny(node.what);
                    }else{
                        permission = ac.can(node.who).updateOwn(node.what);
                    }
                    break;
                
                //DELETE
                case "delete":
                    if(node.any){
                        permission = ac.can(node.who).deleteAny(node.what);
                    }else{
                        permission = ac.can(node.who).deleteOwn(node.what);
                    }
                    break;

                default:
                    node.warn("An error has occurred when selecting the CRUD value!");
                    return null;
            }
           
            //output
            msg.payload = permission.granted;
            msg.attributes = permission.attributes;

            node.send(msg);
        });
    }
    RED.nodes.registerType("permission", PermissionNode);
}