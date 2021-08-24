module.exports = function(RED) {
    function ExportNode(config) {
        RED.nodes.createNode(this,config);

        //options
        
        //context selection (change ".flow" to ".global" for global context)
        var flowContext = this.context().flow;

        //MAIN code
        var node = this;
        node.on('input', function(msg) {

            const ac = flowContext.get("accesscontrol");

            //clear message
            msg = {};
            //add grants to payload (string)
            msg.payload = ac.getGrants();
           

            node.send(msg);
        });
    }
    RED.nodes.registerType("export", ExportNode);
}