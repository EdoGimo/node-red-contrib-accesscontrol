<script type="text/javascript">
    RED.nodes.registerType('extend',{
        category: 'access control',
        color: '#ca9758',
        defaults: {
            name: {value:""},
            who: {value:""},
            what: {value:""}
        },
        inputs:1,
        outputs:0,
        icon: "font-awesome/fa-shield",
        label: function() {
            return this.name||"extend";
        }
    });
</script>


<script type="text/html" data-template-name="extend">
    <div class="form-row">
        <label for="node-input-name"><i class="fa fa-tag"></i> Name</label>
        <input type="text" id="node-input-name" placeholder="Name">
    </div>
    <p>Check the "Help" tab for more information on the parameters.</p>

    <hr>

    <div class="form-row">
        <label for="node-input-who"><i class="fa fa-user-circle"></i> Inheritant</label>
        <input type="text" id="node-input-who" placeholder="User">
    </div>

    <div class="form-row">
        <label for="node-input-what"><i class="fa fa-user-circle-o"></i> Inheritor</label>
        <input type="text" id="node-input-what" placeholder="User">
    </div>
</script>

<script type="text/html" data-help-name="extend">
    <p>Details on module logic at: <a href="https://www.npmjs.com/package/accesscontrol">npmjs.com/accesscontrol</a>.</p>
    <h4>Extend node</h4>
    <p>This node, receiving a message in input, grants to a certain user the permissions of another user.</p>
    <p>The attributes that can be set are:</p>
    <ul>
    <li>Inheritant: the user that will receive the permissions;</li>
    <li>Inheritor: the user that extends the permissions of the previous user.</li>
    </ul>
    <p><b>Note:</b> All text fields can also be specified using the msg attributes (e.g., writing msg.user in an input field will force the node to look inside the content of msg.user). Only names with letters and numbers are supported.</p>
</script>