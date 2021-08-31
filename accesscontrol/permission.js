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

            if(!whoField || !whatField || !node.crud){
                node.warn("WHO or WHAT fields not specified. Check the msg attributes are not empty!");
                return null;
            }

            
            const ac = flowContext.get("accesscontrol");
            var permission = null;

            switch(node.crud){
                //CREATE
                case "create":
                    if(node.any){
                        permission = ac.can(whoField).createAny(whatField);
                    }else{
                        permission = ac.can(whoField).createOwn(whatField);
                    }
                    break;
                
                //READ
                case "read":
                    if(node.any){
                        permission = ac.can(whoField).readAny(whatField);
                    }else{
                        permission = ac.can(whoField).readOwn(whatField);
                    }
                    break;
                
                //UPDATE
                case "update":
                    if(node.any){
                        permission = ac.can(whoField).updateAny(whatField);
                    }else{
                        permission = ac.can(whoField).updateOwn(whatField);
                    }
                    break;
                
                //DELETE
                case "delete":
                    if(node.any){
                        permission = ac.can(whoField).deleteAny(whatField);
                    }else{
                        permission = ac.can(whoField).deleteOwn(whatField);
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