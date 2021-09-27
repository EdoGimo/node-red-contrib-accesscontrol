module.exports = function(RED) {
    function ExtendNode(config) {
        RED.nodes.createNode(this,config);

        //options
        this.who = config.who;  //Beneficiary
        this.whoType = config.whoType;
        this.what = config.what;    //Inherit from
        this.whatType = config.whatType;

        
        //context selection (change ".flow" to ".global" for global context)
        var flowContext = this.context().flow;

        //MAIN code
        var node = this;
        node.on('input', function(msg) {
            
            try{

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

                //check if configuration was set
                if(!whoField || !whatField){
                    throw new Error("WHO or WHAT fields not specified. Check the msg attributes are not empty!");
                }

                //check if WHO and WHAT are the same role (a role cannot be extended by itself)
                if(whoField == whatField){
                    throw new Error("Can't extend a role with itself!");
                }

                const ac = flowContext.get("accesscontrol");

                if(!ac){
                    throw new Error("AccessControl instance non-existent. Set it with 'AC init' first.");
                }

                //check if WHAT exists (a role cannot be extended by a non-existent role)
                if (! (ac.getRoles()).includes(whatField)){
                    throw new Error("The 'Inherit from' role does not exist. Create it with the grant node before.");
                }

                //extend role
                ac.grant(whoField).extend(whatField);
            

                node.send(msg);


            }catch(e){
                node.error(e.message);
                return null;
            }
        });
    }
    RED.nodes.registerType("extend", ExtendNode);
}