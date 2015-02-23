this.Schemas = {};


this.getAutoMac = function(collection,field){
    var sort = {};
    sort[field] = -1;
    var last = this[collection].findOne({}, {sort: sort});
	if(!last)
		return 1;
	return last[field] + 1;  
}