module.imports = function(RED) {
    function ImportNode(config) {
        RED.nodes.createNode(this,config);

        //options
        
        //context selection (change ".flow" to ".global" for global context)
        var flowContext = this.context().flow;

        //MAIN code
        var node = this;
        node.on('input', function(msg) {

            const ac = flowContext.get("accesscontrol");

            //read grants from payload (string)
            msg.payload = ac.setGrants(JSON.parse(msg.payload));

            //catch AccessControlError
            try {
                //read grants from payload (string)
                msg.payload = ac.setGrants(JSON.parse(msg.payload));

                return null;
            }
            catch(err) {
                node.warn("Import node failed. Check formatting of the payload string.");
            }


            //clear message
            msg = {};

            node.send(msg);
        });
    }
    RED.nodes.registerType("import", ImportNode);
}