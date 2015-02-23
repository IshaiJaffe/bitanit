Template.searchField.events = {
	'keyup .search-field' : function (e) {
		var ui = e.currentTarget;
		var val = ui.value;		
		var query = ui.getAttribute('data-query').substr(1);
		if(!val){
			query = query.replace('_search=__value__','');
			return Router.go(Router.current().route.getName(),{},{query:query});
		}
		query = query.replace('__value__',encodeURIComponent(val));
		Router.go(Router.current().route.getName(),{},{query:query});
    }
};
Template.tableBody.events = {
	'click .itemLink':function(e){
		var ui = e.currentTarget;
		var id = ui.getAttribute('data-item').replace(/ObjectID\("([0-9a-f]+)"\)/i,'$1');
		return Router.go(Router.current().route.getName() + 'Item',{id:id});
	}
};
Template.tableFooter.events = {
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