module.exports = function(RED) {
    function ExtendNode(config) {
        RED.nodes.createNode(this,config);

        //options
        this.who = config.who;
        this.whoType = config.whoType;
        this.what = config.what;
        this.whatType = config.whatType;

        
        //context selection (change ".flow" to ".global" for global context)
        var flowContext = this.context().flow;

        //MAIN code
        var node = this;
        node.on('input', function(msg) {


            //get the actual value of WHO and WHAT if msg was selected
            if(node.whoType == "msg"){
                node.who = RED.util.getMessageProperty(msg,node.who);
            }
            if(node.whatType == "msg"){
                node.what = RED.util.getMessageProperty(msg,node.what);
            }

            //check if configuration was set
            if(!node.who || !node.what){
                node.warn("WHO or WHAT fields not specified. Check the msg attributes are not empty!");
                return null;
            }

            const ac = flowContext.get("accesscontrol");

            if (! (ac.getRoles()).includes(node.what)){
                node.warn("The 'Inherit from' role does not exist. Create it with the grant node before.");
                return null;
            }

            //TODO TRY-CATCH for inheriting errors

            ac.grant(node.who).extend(node.what);
           

            node.send(msg);
        });
    }
    RED.nodes.registerType("extend", ExtendNode);
}