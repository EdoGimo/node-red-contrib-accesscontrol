module.exports = function (RED) {
    function ACInitNode(config) {
        RED.nodes.createNode(this, config);

        //options
        this.force = config.force;

        //context selection (change ".flow" to ".global" for global context)
        var flowContext = this.context().flow;

        //MAIN code
        var node = this;

        node.on('input', function (msg) {

            try {


                //abort if flowcontext has already been set in the context
                if (!node.force && flowContext.get("accesscontrol") != null) {
                    throw new Error("Context already set.");
                }

                const AccessControl = require('accesscontrol');
                const ac = new AccessControl();


                //set context for following nodes
                flowContext.set("accesscontrol", ac);

                if(!flowContext.get("accesscontrol")){
                    throw new Error("An unexpected error has caused the accesscontrol instance not to be set.");
                }

            } catch (e) {
                node.error(e.message);
                return null;
            }
        });
    }
    RED.nodes.registerType("AC init", ACInitNode);
}