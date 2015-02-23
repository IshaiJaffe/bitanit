// Generated by CoffeeScript 1.4.0
(function() {

  this.Items = new Meteor.Collection('items');
   

  Schemas.Items = new SimpleSchema({
	mac: {
      type: Number,
      decimal: false,
	  unique: true,
	  label:'מק"ט',
	  autoValue: function() {
        if (!this.isInsert || this.value)
		   return;
		return getAutoMac('Items','mac');
      }
    },
	name:{
	  type: String,
	  max:30,
	  label:'שם'
	},
    description: {
      type: String,
	  label:'תיאור',
	  optional:true,
      autoform: {
        rows: 5
      }
    },
	store : {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		label:'מחסן',
	  autoform: {
		options: function() {
		  return _.map(Suppliers.find().fetch(), function(item) {
			return {
			  label: item.name,
			  value: item._id
			};
		  });
		}
	  }
	},
    storeMac: {
      type: String,
      max: 10,
	  unique: true,
	  label:'מק"ט ספק',
	  autoValue:function(){
	      if(!this.field('autoValue'))
			  return this.field('mac');
	  }
    },
	quantity:{
	   type:Number,
	   min:0,
	   decimal:false,
	   label:'כמות',
	   defaultValue:0	   
	},
	allocatedQuantity:{
	   type:Number,
	   min:0,
	   decimal:false,
	   label:'כמות משוריינת',
	   defaultValue: 0
	},
	orderedQuantity:{
	   type:Number,
	   min:0,
	   decimal:false,
	   label:'כמות בהזמנה',
	   defaultValue:0
	},
    createdAt: {
      type: Date,
	  label:'נוצר ב',
      autoValue: function() {
        if (this.isInsert) {
          return new Date();
        }
      }
    },
    updatedAt: {
      type: Date,
      optional: true,
	  label:'עודכן ב',
      autoValue: function() {
        if (this.isUpdate) {
          return new Date();
        }
      }
    },
    picture: {
      type: String,
	  label:'תמונה',
	  optional:true,
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: 'Attachments'
        }
      }
    },
    creator: {
      type: String,
	  label:'נוצר ע"י',
      regEx: SimpleSchema.RegEx.Id,
      autoValue: function() {
        if (this.isInsert) {
          return Meteor.userId();
        }
      },
      autoform: {
        options: function() {
          return _.map(Meteor.users.find().fetch(), function(user) {
            return {
              label: user.emails[0].username,
              value: user._id
            };
          });
        }
      }
    },
	addedQuantity:{
		type:Number,
		optional:true
	}
  });

  Items.attachSchema(Schemas.Items);
  
  Items.search = function(val,query,options){
	   query = query || {};
	   var reg = new RegExp(val,'i');
	   query['$or'] = [{name:reg},{mac:Number(val)},{description:reg},{storeMac:reg}];
	   return Items.find(query,options);
  };

}).call(this);