module.exports = function(RED) {
    function ACImportNode(config) {
        RED.nodes.createNode(this,config);

        //options
        
        //context selection (change ".flow" to ".global" for global context)
        var flowContext = this.context().flow;

        //MAIN code
        var node = this;
        node.on('input', function(msg) {

            const ac = flowContext.get("accesscontrol");

            //catch AccessControlError
            try {
                //read grants from payload (string)
                ac.setGrants(msg.payload);
                node.warn("Permissions successfully imported.");

                //clear msg
                msg = {};

                node.send(msg);
            }
            catch(err) {
                node.warn("Import node failed. Check formatting of the payload string.");
            }
        });
    }
    RED.nodes.registerType("AC import", ACImportNode);
}