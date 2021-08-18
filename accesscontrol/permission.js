module.exports = function(RED) {
    function PermissionNode(config) {
        RED.nodes.createNode(this,config);

        //options
        this.who = config.who;
        this.whoType = config.whoType;
        this.crud = config.crud;
        this.any = config.any;
        this.what = config.what;
        this.whatType = config.whatType;

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

            //get the actual value of WHO and WHAT if msg was selected
            if(node.whoType == "msg"){
                node.who = RED.util.getMessageProperty(msg,node.who);
            }
            if(node.whatType == "msg"){
                node.what = RED.util.getMessageProperty(msg,node.what);
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