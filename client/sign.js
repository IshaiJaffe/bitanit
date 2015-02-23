

Template.workOrdersItem.events = {
	'click .checklist>li>button' : function (e) {
		var ui = e.currentTarget;
		var stage = $(ui).parents('li[data-stage]').data('stage');
		
		var workOrder = Router.current().data().document;
		var canSign = WorkOrders.canSignStage(workOrder,stage);
		if(canSign !== true){
			Meteor.alert('לא ניתן לאשר לפני: ' + canSign);
			return;
		}
		
		var stageData = WorkOrders.Stages[stage];
		var getImageFunc = stageData.external ? scan : sign;
		getImageFunc(function(imageData){
			if(!imageData)
				return;
			
			Attachments.insert(imageData, function (err, fileObj) {
				if(err)
					return console.error(err);
				console.log(fileObj);
				var doc = workOrder;
				Meteor.call('setStage',doc._id + '',stage, fileObj._id + '',function(err){
					if(err)
						return console.error(err);
				});

			});
		});
		
    },
	'click .checklist>li>i':function(e) {
		var ui = e.currentTarget;
		var stageName = $(ui).parents('li[data-stage]').data('stage');
		var workOrder = Router.current().data().document;
		var stageStatus = _.find(workOrder.stages,function(s) { return s.name == stageName; });
		var approvedBy = Meteor.users.findOne({_id:stageStatus.by});
		var attachment = Attachments.findOne({_id:stageStatus.signature});
		var date = stageStatus.date.toString();
		var imageLink = attachment.original.type.indexOf('image') > -1 ? '<img style="width:100%" src="' + attachment.url() + '" />' : '<a target="_blank" download href="' + attachment.url() + '">הורד קובץ</a>';
		Meteor.alert('אושר ע"י ' + userName(approvedBy) + ' בתאריך ' + date + '<br>' + imageLink);
	},
	'click #sendWorkOrder':function(){
		var workOrder = Router.current().data().document;
		if(!_.all(workOrder.stages,function(s) { return s.approved; }))
			return Meteor.alert('לא ניתן לשלוח עד אשר כל המשימות אושרו');
			
		history.back();
		Meteor.call('sendWorkOrder',workOrder._id + '');
	}
};

window.scan = function(callback){
	bootbox.dialog({
	  title: 'העלה מסמך אישור',
	  message: '<input id="uploadButton" type="file" />',
	  buttons:{
		approve:{
			label:'העלה',
			className:'btn-danger',
			callback:function(){
				var $file = $('#uploadButton');
				var file = $file[0].files[0];
				if(!file)
					return false;
									
				callback(file);
			}
		},
		cancel:{
			label:'בטל',
			callback:function(){
				callback();
			}
		}
	  }
	});
}

window.sign = function(callback){

	username = userName();
	var signaturePad;
	bootbox.dialog({
	  title: 'מאושר ע"י ' + username + ' בתאריך ' + moment().format('D/M/YYYY'),
	  message: '<div class="sign-pad"><canvas></canvas><span class="watermark">חתימה</span></div>',
	  buttons:{
		approve:{
			label:'חתום אישור',
			className:'btn-danger',
			callback:function(){
				if(signaturePad.isEmpty())
					return window.sign(callback);
					
				var imageData = signaturePad.toDataURL();
				callback(imageData);
			}
		},
		cancel:{
			label:'בטל',
			callback:function(){
				callback();
			}
		}
	  }
	});
	setTimeout(function(){
		var canvas = document.querySelector("canvas");
		$(canvas).attr('width',$(canvas).width()).attr('height',$(canvas).height());
		signaturePad = new SignaturePad(canvas);		
	},500);
}