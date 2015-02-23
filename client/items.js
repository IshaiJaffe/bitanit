Template.macAutoComplete.helpers({
  macs: function() {
      
	return _.map(_.groupBy(Items.find().fetch(),'store'),function(macs,storeId) { 
		var store = Suppliers.findOne({_id:storeId}); 
		return {
			name:storeId, 
			valueKey:'mac',
			display:function(obj) { return obj.mac + ''; },
			suggestion:'mac',
			local:macs, 
			header:'<h4>' + (store ? store.name : '') + '</h4>'
		};
	});		
  }
});
Template.inventoryNew.rendered = function() {
  Meteor.typeahead.inject();
};

Template.macAutoComplete.events = {
	'change #macAutocomplete, selected #macAutocomplete':function(e) { 
		var ui = e.currentTarget;
		var val = ui.value;		
		if(!val)
			return;

		var lastItem = $(ui).data('lastItem');
		if(lastItem == val)
			return;
		$(ui).data('lastItem',val);
		var item = Items.findOne({mac:Number(val)});
		if(!item)
			return;
		
		for(var key in item) {
			$('form input[name="' + key + '"],form select[name="' + key + '"]').val(item[key]);
		}
	}
};
