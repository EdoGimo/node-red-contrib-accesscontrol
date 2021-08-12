module.exports = function(RED) {
    function ACSetNode(config) {
        RED.nodes.createNode(this,config);
        
        //options
        this.force = config.force;

        //context selection (change ".flow" to ".global" for global context)
        var flowContext = this.context().flow;

        //MAIN code
        var node = this;

        node.on('input', function(msg) {

            //abort if flowcontext has already been set in the context
            if(!node.force && flowContext.get("accesscontrol") != null){
                return null;
            }
            const AccessControl = require('accesscontrol');
            const ac = new AccessControl();


            //set context for following nodes
            flowContext.set("accesscontrol", ac);
           
            //node.send(msg);
        });
    }
    RED.nodes.registerType("AC init", ACSetNode);
}