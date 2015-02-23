

this.FormConfig = {
	Items:{
		getDocument:function(id){
			return Items.findOne({_id:id});
		},
		actions:[
			{
				id:'edit',
				name:'ערוך',
				fa:'edit',
				handler:function(data){
					var document = data.document;
					Router.go(Router.current().route.getName() + 'Edit',{id:document._id + ''});
					return false;
				}
			},
			{
				id:'delete',
				name:'מחק',
				fa:'remove',
				handler:function(data){
					Meteor.confirm('אתה בטוח?',function(result) {
						if(!result)
							return;
						history.back();						
						Items.remove(data.document._id);
					});
					return false;
				}
			}
		],
		collection:'Items',
		id:'itemForm'
	},
	WorkOrders:{
		getDocument:function(id){
			return WorkOrders.findOne({_id:id});
		},
		actions:[],
		collection:'WorkOrders',
		id:'workOrderForm'
	},
    InventoryOrders:{
        getDocument:function(id){
            return InventoryOrders.findOne({_id:id});
        },
        actions:[],
        collection:'InventoryOrders',
        id:'inventoryOrderForm'
    },
	getData:function(params,config,isEdit){		
		var doc;
		var id = params.id;
		if(id) {
			if(id.length == 24)
				id = new Mongo.ObjectID(id);
			doc = config.getDocument(id);
		}
		var hasSave = isEdit || !doc;

        return {
			hasBack:true,
			hasSave:hasSave,
			collection:config.collection,
			id:config.id,
			config:config,
			actions:hasSave ? [] : config.actions,
			document:doc
		};
	}
}
