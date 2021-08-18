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

            //check if configuration was set
            if(!node.who || !node.what){
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

            ac.grant(node.who).extend(node.what);
           

            node.send(msg);
        });
    }
    RED.nodes.registerType("extend", ExtendNode);
}