var should = require("should");
var helper = require("node-red-node-test-helper");

var requiredNodes = [
    require("../accesscontrol/grant.js"),
    require("../accesscontrol/ac_init.js"),
    require("../accesscontrol/permissions.js")
];

//https://www.npmjs.com/package/node-red-node-test-helper
//https://nodered.org/docs/creating-nodes/first-node#unit-testing
//https://github.com/node-red/node-red-nodes/blob/master/test/function/rbe/rbe_spec.js
//https://github.com/node-red/node-red/wiki/Testing
//https://github.com/node-red/node-red/blob/master/test/nodes/core/common/20-inject_spec.js (es. context)
//https://www.technicalfeeder.com/2021/02/how-to-write-node-red-flow-test/

describe('grant Node', function () {

    before(() => {
        helper.init(require.resolve('node-red'));
    });

    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function(done) {
        helper.unload().then(function () {
            helper.stopServer(done);
        });
    });


    //check correct loading
    it('should be loaded', function (done) {
        var flow = [
            { id: "n1", type: "AC init", name: "AC init" },
            { id: "n2", type: "grant", name: "grant" },
            { id: "n3", type: "permissions", name: "permissions" }
        ];

        helper.load(requiredNodes, flow, function () {

            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            var n3 = helper.getNode("n3");

            try {
                //AC INIT
                n1.should.have.property('name', 'AC init');

                //GRANT
                n2.should.have.property('name', 'grant');

                //PERMISSIONS
                n3.should.have.property('name', 'permissions');
                
                done();

            } catch (err) {
                done(err);
            }
        });
    });


    /*//Following block does not work, execution stops at AC init probably for something context related (timeout error)
    //check grant works
    it('should grant', function (done) {

        //flow defimition (default type must be provided since it is in the HTML normally)
        var flow = [
            {
                id: "n1", type: "AC init", name: "init", force: true, check: true, wires: [["n2"]]
            },
            {
                id: "n2", type: "grant", name: "grant",
                    whoType: "string", who: "role", 
                    createAnyType: "bool", createAny: true,
                    createOwnType: "bool", createOwn: false,
                    createType: "string", create: "",
                    readAnyType: "bool", readAny: false,
                    readOwnType: "bool", readOwn: false,
                    readType: "string", read: "",
                    updateAnyType: "bool", updateAny: false,
                    updateOwnType: "bool", updateOwn: false,
                    updateType: "string", update: "",
                    deleteAnyType: "bool", deleteAny: false,
                    deleteOwnType: "bool", deleteOwn: false,
                    deleteType: "string", delete: "",
                    whatType: "string", what: "resource",
                wires: [["n3"]]
            },
            {
                id: "n3", type: "permissions", name: "perm",
                whoType: "string", who: "role", 
                createAnyType: "bool", createAny: true,
                createOwnType: "bool", createOwn: false,
                createType: "string", create: "",
                readAnyType: "bool", readAny: false,
                readOwnType: "bool", readOwn: false,
                readType: "string", read: "",
                updateAnyType: "bool", updateAny: false,
                updateOwnType: "bool", updateOwn: false,
                updateType: "string", update: "",
                deleteAnyType: "bool", deleteAny: false,
                deleteOwnType: "bool", deleteOwn: false,
                deleteType: "string", delete: "",
                whatType: "string", what: "resource",
                wires: [["n4"]]
            },
            { id: "n4", type: "helper" }
        ];

        //load flow
        helper.load(requiredNodes, flow, function () {
            var n4 = helper.getNode("n4");
            var n3 = helper.getNode("n3");
            var n2 = helper.getNode("n2");
            var n1 = helper.getNode("n1");

            console.log('n1---', n1);
            console.log('n2---', n2);
            console.log('n3---', n3);
            console.log('n4---', n4);

            //what the result should be
            n4.on("input", function (msg) { //msg, send, done? o pure context???
                try {
                    msg.should.have.a.property("payload");
                    msg.payload.toString().should.equal("true");
                    done();
                } catch (err) {
                    done(err);
                }
            });

            //start execution with empty message
            n1.receive({ payload: true });

        });
    }).timeout(30000); //ensure enough time is given*/
});