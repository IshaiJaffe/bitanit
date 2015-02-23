// Generated by CoffeeScript 1.4.0
(function() {

  this.Suppliers = new Meteor.Collection('suppliers');
   

  Schemas.Suppliers = new SimpleSchema({
	name:{
	  type: String,
	  unique:true,
	  max:30,
	  label:'שם'
	},
    email: {
      type: String,
	  unique:true,
      regEx: SimpleSchema.RegEx.Email,
	  label:'דוא"ל'
    },
	address: {
      type: String,
	  label:'כתובת'
    },
	phone:{
      type:String,
	  label:'טלפון'
	},
  });

  Suppliers.attachSchema(Schemas.Suppliers);

}).call(this);