Template.formFooter.events = {
    'click .tableActions>li>a': function(e){
		var ui = e.currentTarget;
		var actionId = ui.hash.substr(1);
		var data = Router.current().data();
		var config = data.config;
		var action = _(config.actions).find(function(a) { return a.id == actionId; });
		if(action.handler(data) === false)
			e.preventDefault();
	}	
}