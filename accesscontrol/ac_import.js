module.exports = function(RED) {
    function ACImportNode(config) {
        RED.nodes.createNode(this,config);

        //options
        this.mongo = config.mongo;
        this.mongoType = config.mongoType;
        
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

            //catch AccessControlError
            try {

                const ac = flowContext.get("accesscontrol");

                if(!ac){
                    throw new Error("AccessControl instance non-existent. Set it with 'AC init' first.");
                }

                if(mongoField){
                    var index = db.findIndex(x => x._id === mongoField);

                    if(index == -1){
                        throw new Error("Cannot find the specified MongoDB '_id' in the JSON.");
                    }

                    delete db[index]._id;
                    db = db[index];
                }

                //read grants from payload (string)
                ac.setGrants(db);
                node.log("Permissions successfully imported.");

                //clear msg
                msg = {};

                
                node.send(msg);


            }catch(e) {
                if (e instanceof TypeError){
                    node.warn("Missing payload or value not an AccessControl compatible JSON.");
                    return null;
                } else{
                    node.warn(e.message);
                    return null;
                }
            }
        });
    }
    RED.nodes.registerType("AC import", ACImportNode);
}