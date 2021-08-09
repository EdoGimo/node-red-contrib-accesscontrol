module.exports = function(RED) {
    function ExtendNode(config) {
        RED.nodes.createNode(this,config);

        //options
        this.who = config.who;
        this.what = config.what;

        
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


            //check if some fields have a msg as an attribute
            let re = new RegExp('^msg.[a-zA-Z0-9]+$');

            //get actual value
            //Inheritant
            if(re.test(node.who)){
                var x = eval(node.who);
                node.warn("Using "+ node.who +" value for the Inheritant.");
                node.who = x;
            }
            //Inheritor
            if(re.test(node.what)){
                var x = eval(node.what);
                node.warn("Using "+ node.what +" value for the Inheritor.");
                node.what = x;
            }

            ac.grant(node.who).extend(node.what);
           

            //node.send(msg);
        });
    }
    RED.nodes.registerType("extend", ExtendNode);
}