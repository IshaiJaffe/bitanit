
this.TableConfig = {
	Items:{
		title:'מלאי',
		orderBy:'-mac',
		filters:function(){
			var suppliers = Suppliers.find().fetch();
			return [{
					id:'store',
					isFirst:true,
					values:[{id:'',name:'כל מחסן'}].concat(suppliers.map(function(sup) {
						return {id:sup._id,name:sup.name};
					})),			
					name:'מחסן'	
				},{
					id:'quantity',
					values:[{name:'כל כמות',id:''},{name:'אזל',id:0},{name:'יש במחסן',id:JSON.stringify({$gt:0})}]
				}];
		},
		columns:[
			{id:'mac',name:'מק\"ט'},
			{id:'name',name:'שם'},
			{id:'quantity',name:'כמות'}
		],
		searchable:true,
		actions:[
			{id:'create',name:'הוסף',fa:'plus',handler:function() {
				Router.go(Router.current().route.getName() + 'New');
				return false;
			}},
			{id:'scan',name:'סרוק',fa:'barcode',handler:function() {
				scanBarcode(function(barcode) { 
					Router.go(Router.current().route.getName() + 'New',{barcode:barcode});
				});
				return false;
			}}
		],
		data:function(search,query,options){
			return search ? Items.search(search,query,options) : Items.find(query,options);
		}
	},
	WorkOrders:{
		title:'הזמנות עבודה',
		orderBy:'-id',
		filters:function(){
			return [{
					id:'deliveryDate',
					values:[{name:'טרם נשלח',id:'null'},{name:'נשלח',id:JSON.stringify({$ne:null})}]
				}];
		},
		columns:[
			{id:'id',name:'#'},
			{id:'room',name:'חדר',view:function(val) { 
				var room = Rooms.findOne({_id:val});
				return room ? room.name : '';
			}},
			{id:'deadline',name:'תאריך'},
			{id:'deliveryDate',name:'נשלח',view:function(val){
				if(!val)
					return '';
				return '<i class="fa fa-check"></i>';
			}}
		],
		actions:[], 
		data:function(search,query,options){
			return WorkOrders.find(query,options);
		}
	},
    InventoryOrders:{
        title:'הזמנות מלאי',
        orderBy:'-id',
        filters:function(){
            var suppliers = Suppliers.find().fetch();
            return [{
                id:'supplier',
                isFirst:true,
                values:[{id:'',name:'כל מחסן'}].concat(suppliers.map(function(sup) {
                    return {id:sup._id,name:sup.name};
                })),
                name:'מחסן'
            }, {
                id:'deliveryDate',
                values:[{name:'התקבל',id:JSON.stringify({$ne:null})},{name:'לא התקבל',id:'null'}]
            }];
        },
        columns:[
            {id:'id',name:'#'},
            {id:'supplier',name:'מחסן',view:function(val) {
                var supplier = Suppliers.findOne({_id:val});
                return supplier ? supplier.name : '';
            }},
            {id:'orderDate',name:'תאריך'},
            {id:'deliveryDate',name:'התקבל',view:function(val){
                if(!val)
                    return '';
                return '<i class="fa fa-check"></i>';
            }}
        ],
        actions:[],
        data:function(search,query,options){
            return InventoryOrders.find(query,options);
        }
    },
	getData:function(originalQuery,config, rows){
		var search = originalQuery._search;
		if(!originalQuery._orderBy)
			originalQuery._orderBy = config.orderBy;
		var orderBy = originalQuery._orderBy;
		var query = _.clone(originalQuery);
		delete query._search;
		delete query._orderBy;
		delete query[''];
		var filters = config.filters();
		var currentFilters = [];
		for(key in query){
			var filter = _.find(filters,function(filter){
				return filter.id == key;
			});
			if(!filter || !filter.values)
				continue;
			var filterValue = _.find(filter.values,function(val){
				return val.id.toString() === query[key];
				});
			if(filterValue)
				currentFilters.push(filterValue);
		}
		for(var key in query){
			if(!isNaN(Number(query[key])))
				query[key] = Number(query[key]);
			else if(query[key] == 'false'  || query[key] == 'true')
				query[key] = Boolean(query[key]);
			else {
				try{
					query[key] = JSON.parse(query[key]);
				}
				catch(e){
				}
			}
		}
		var options = {};
		if(orderBy){
			var desc = orderBy[0] == '-';
			if(desc)
				orderBy = orderBy.substr(1);
			var sort = {};
			sort[orderBy] = desc ? -1 : 1;
			options.sort = sort;
		}
		var itemCursor = config.data(search,query,options);
		
		var createQuery = function(key,val){
		     var newQuery = _.clone(originalQuery);
			 if(val === '')
				delete newQuery[key];
			else
				newQuery[key] = val;
			return '?' + _.map(newQuery,function(val,key) {
				return encodeURIComponent(key) + '=' + encodeURIComponent(val);
			}).join('&');
		};
		
		Template.registerHelper('createQuery',createQuery);
		Template.registerHelper('orderBy',function(key){
		     var newQuery = _.clone(originalQuery);
			 if(!options.sort || !options.sort[key])
				newQuery['_orderBy'] = key;
			 else{
				var desc = options.sort[key] == 1;
				newQuery['_orderBy'] = (desc ? '-' : '') + key;
			 }
			return '?' + _.map(newQuery,function(val,key) {
				return encodeURIComponent(key) + '=' + encodeURIComponent(val);
			}).join('&');
		});
		rows = rows || itemCursor.fetch();
        return {
			hasBack:false,
		  columns:config.columns.map(function(column) { 
			return {id:column.id, name:column.name, order:(options.sort && options.sort[column.id]) || 0, view:column.view};
		  }),
		  config:config,
		  searchQuery:createQuery('_search','__value__'),
		  serach:search,
		  title:currentFilters.length ? _.pluck(currentFilters,'name').join(', ') : config.title,
		  filters:filters,
		  searchable:config.searchable,
		  actions:config.actions,
		  rows:rows
        };
	}
 }
