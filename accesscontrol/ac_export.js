module.exports = function(RED) {
    function ACExportNode(config) {
        RED.nodes.createNode(this,config);

        //options
        this.mongo = config.mongo;
        this.mongoType = config.mongoType;
        
        //context selection (change ".flow" to ".global" for global context)
        var flowContext = this.context().flow;

        //MAIN code
        var node = this;
        node.on('input', function(msg) {

            var mongoField;
            

            //get the actual value of _id if msg was selected
            if(node.mongoType == "msg"){
                mongoField = RED.util.getMessageProperty(msg,node.mongo);
            }else{
                mongoField = node.mongo;
            }

            const ac = flowContext.get("accesscontrol");

            //clear msg
            msg = {};

            //add mongoDB _id value, to override the object in mongoDB when using 'save'
            if (mongoField){
                msg._id = mongoField;
            }
        
            //add grants to payload (string)
            msg.payload = ac.getGrants();
           

            node.send(msg);
        });
    }
    RED.nodes.registerType("AC export", ACExportNode);
}