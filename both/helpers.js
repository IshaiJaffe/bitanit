
this.userName = function(user) {
	user = user || Meteor.user();
	return user.name|| user.emails[0].address.split('@')[0];
};

_.indexById = function(collection){
    return _.indexBy(collection,function(d){
        return d._id + '';
    });
};