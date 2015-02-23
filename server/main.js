Meteor.startup(function () {
// code to run on server at startup
	console.log('on start up');
	Meteor.methods ({
		setStage:function(workOrderId,stageName,imageURL,callback){
			var workOrder = WorkOrders.findOne({_id:workOrderId});			
			if(!workOrder)
				return callback && callback(404);
			var stage = _.find(workOrder.stages,function(s) { return s.name == stageName; });
			var userId = Meteor.userId();
			stage.by = userId;
			stage.date = new Date();
			stage.signature = imageURL;
			stage.approved = true;
			console.log(workOrder);
			WorkOrders.update(workOrder._id,{$set:{stages:workOrder.stages}});
			
			callback && callback();
		},
		sendWorkOrder:function(workOrderId){
			var workOrder = WorkOrders.findOne({_id:workOrderId});
			if(!_.all(workOrder.stages,function(s) { return s.approved; }))
				throw new Error('!!');
			
			WorkOrders.update(workOrder._id,{$set:{deliveryDate: new Date(),closedBy:Meteor.userId()}});
		},
		addInventory:function(document,modifier) {
			var mac = modifier.$set.mac;
			var addedQuantity = modifier.$set.addedQuantity;
			delete modifier.$set.addedQuantity;
			document = Items.findOne({mac:mac});
			if(document){
				console.log('Already exists');
				delete modifier.$set.mac;
				modifier.$set.quantity = document.quantity + addedQuantity;
				console.log(modifier);
				return Items.update(document._id,modifier);
			}
			
			modifier.$set.quantity = addedQuantity;
			Items.insert(modifier.$set);			
		}
	});
});
