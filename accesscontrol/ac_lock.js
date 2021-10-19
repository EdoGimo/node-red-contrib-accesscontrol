module.exports = function (RED) {
    function ACLockNode(config) {
        RED.nodes.createNode(this, config);

        //options

        //context selection (change ".flow" to ".global" for global context)
        var flowContext = this.context().flow;

        //MAIN code
        var node = this;

        node.on('input', function (msg) {


            try {
                const ac = flowContext.get("accesscontrol");

                if (!ac) {
                    throw new Error("AccessControl instance non-existent. Set it with 'AC init' first.");
                }

                if (ac.isLocked) {
                    throw new Error("The instance is already locked.");
                }

                ac.lock();

                if (!ac.isLocked) {
                    throw new Error("An error occured while locking the instance.");
                }

                node.warn("Instance locked.");

            } catch (e) {
                node.error(e.message);
                return null;
            }


        });
    }
    RED.nodes.registerType("AC lock", ACLockNode);
}