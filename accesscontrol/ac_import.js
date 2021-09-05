module.exports = function(RED) {
    function ACImportNode(config) {
        RED.nodes.createNode(this,config);

        //options
        this.mongo = config.mongo;
        this.mongoType; config.mongoType;
        
        //context selection (change ".flow" to ".global" for global context)
        var flowContext = this.context().flow;

        //MAIN code
        var node = this;
        node.on('input', function(msg) {

            var db = msg.payload;
            var mongoField;

            //get the actual value of _id if msg was selected
            if(node.mongoType == "msg"){
                mongoField = RED.util.getMessageProperty(msg,node.mongo);
            }else{
                mongoField = node.mongo;
            }

            const ac = flowContext.get("accesscontrol");

            //catch AccessControlError
            try {

                if(mongoField){
                    var index = db.findIndex(x => x._id === mongoField);

                    if(index == -1){
                        node.warn("Cannot find the specified MongoDB '_id' in the JSON.");
                        return null;
                    }

                    delete db[index]._id;
                    db = db[index];
                }

                //read grants from payload (string)
                ac.setGrants(db);
                node.warn("Permissions successfully imported.");

                //clear msg
                msg = {};

                node.send(msg);
            }
            catch(error) {
                if (error instanceof TypeError){
                    node.warn("Missing payload or value not an AccessControl compatible JSON.");
                    return null;
                } else{
                    throw error;
                }
            }
        });
    }
    RED.nodes.registerType("AC import", ACImportNode);
}