module.exports = function(RED) {
    function ACExportNode(config) {
        RED.nodes.createNode(this,config);

        //options
        
        //context selection (change ".flow" to ".global" for global context)
        var flowContext = this.context().flow;

        //MAIN code
        var node = this;
        node.on('input', function(msg) {

            const ac = flowContext.get("accesscontrol");

            //clear msg
            msg = {};
            //add grants to payload (string)
            msg.payload = ac.getGrants();
           

            node.send(msg);
        });
    }
    RED.nodes.registerType("AC export", ACExportNode);
}