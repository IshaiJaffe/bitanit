
Template.query.events = {
	'click .up':function(e){
        var ui = e.currentTarget;
        updateQueryCount(ui,1);
	},
    'click .down':function(e){
        var ui = e.currentTarget;
        updateQueryCount(ui,-1);
    }

};

function updateQueryCount(button,increment){
    var li = $(button).parents('li');
    var roomId = li.data('room');
    var requested = Router.current().data().requested;
    requested[roomId] = requested[roomId] || 0;
    requested[roomId] += increment;
    if(requested[roomId] <= 0)
        delete requested[roomId];
    var queryString = _.map(requested,function(quantity,roomId) {
        return encodeURIComponent(roomId.replace(/ObjectId|[()""]/ig,'')) + '=' + encodeURIComponent(quantity);
    }).join('&');
    Router.go(Router.current().route.getName(),{},{query:queryString});

}