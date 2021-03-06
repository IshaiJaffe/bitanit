// Generated by CoffeeScript 1.4.0
(function () {
    Router.configure({
        layoutTemplate: "masterLayout",
        loadingTemplate: "loading",
        notFoundTemplate: "notFound",
        routeControllerNameConverter: "camelCase"
    });

    Router.map(function () {
        this.route('home', {
            path: '/',
            data: function () {
                return {
                    title:'ביתנית',
                    hideMenu:true
                };
            }
        });
        this.route("inventory", {
            path: "/inventory",
            waitOn: function () {
                return [Meteor.subscribe('items'), Meteor.subscribe('suppliers')];
            },
            data: function () {
                var query = {};
                if (this.params.query)
                    query = this.params.query;
                var config = TableConfig.Items;
                return TableConfig.getData(query, config);
            }
        });
        this.route('inventoryNew', {
            path: '/inventory/new',
            waitOn: function () {
                return [Meteor.subscribe('items'), Meteor.subscribe('suppliers')];
            },
            data: function () {
                var config = FormConfig.Items;
                var data = FormConfig.getData(this.params, config, true);
                data.saveLabel = 'הוסף למלאי';
                return data;
            }
        });

        this.route('inventoryItem', {
            path: '/inventory/:id',
            waitOn: function () {
                return [Meteor.subscribe('items'), Meteor.subscribe('suppliers')];
            },
            data: function () {
                var config = FormConfig.Items;
                return FormConfig.getData(this.params, config);
            }
        });
        this.route('inventoryItemEdit', {
            path: '/inventory/:id/edit',
            waitOn: function () {
                return [Meteor.subscribe('items'), Meteor.subscribe('suppliers')];
            },
            data: function () {
                var config = FormConfig.Items;
                return FormConfig.getData(this.params, config, true);
            }
        });
        this.route('query', {
            path: '/query',
            waitOn: function () {
                return [Meteor.subscribe('items'), Meteor.subscribe('rooms')];
            },
            data: function () {
                var query = {};
                if (this.params.query)
                    query = this.params.query;
                var rooms = Rooms.find().fetch();
                var items = Items.find().fetch();
                var requestedRooms = query;
                for (var roomId in requestedRooms) {
                    requestedRooms[roomId] = Number(requestedRooms[roomId]) || 0;
                }
                var optionalRooms = Rooms.calculateQuery(rooms, items, requestedRooms);
                var isMissing = _.any(optionalRooms, function (room) {
                    return room.isOverLimit;
                });
                return {
                    title: 'שאילתות מלאי',
                    rooms: optionalRooms,
                    requested: requestedRooms,
                    isMissing: isMissing,
                    hasSave: isMissing,
                    saveLabel: 'חסרים',
                    saveAction: 'Router.go("missing",{},{query:"' + Router.current().originalUrl.split('?')[1] + '"}); return false;'
                };
            }
        });
        this.route('missing', {
            path: '/missing',
            waitOn: function () {
                return [Meteor.subscribe('items'), Meteor.subscribe('rooms')];
            },
            data: function () {
                var query = {};
                if (this.params.query)
                    query = this.params.query;
                var rooms = Rooms.find().fetch();
                var items = Items.find().fetch();
                var requestedRooms = query;
                for (var roomId in requestedRooms) {
                    requestedRooms[roomId] = Number(requestedRooms[roomId]) || 0;
                }
                var missing = Rooms.calculateMissing(rooms, items, requestedRooms);

                var config = TableConfig.Items;
                var data = TableConfig.getData({}, config, missing);
                data.title = 'חסרים';
                data.hasBack = true;
                data.searchable = false;
                data.columns.forEach(function (c) {
                    c.noSort = true;
                });
                data.columns[2] = {id: 'missing', name: 'חסר', noSort: true};
                return data;
            }
        });
        this.route("workOrders", {
            path: "/workOrders",
            waitOn: function () {
                return [Meteor.subscribe('workOrders'), Meteor.subscribe('rooms'), Meteor.subscribe('customers')];
            },
            data: function () {
                var query = {};
                if (this.params.query)
                    query = this.params.query;
                var config = TableConfig.WorkOrders;
                return TableConfig.getData(query, config);
            }
        });
        this.route('workOrdersItem', {
            path: '/workOrders/:id',
            waitOn: function () {
                return [Meteor.subscribe('workOrders'), Meteor.subscribe('rooms'), Meteor.subscribe('customers')];
            },
            data: function () {
                var config = FormConfig.WorkOrders;
                return FormConfig.getData(this.params, config);
            }
        });
        this.route("inventoryOrders", {
            path: "/inventoryOrders",
            waitOn: function () {
                return [Meteor.subscribe('inventoryOrders'), Meteor.subscribe('suppliers'), Meteor.subscribe('items')];
            },
            data: function () {
                var query = {};
                if (this.params.query)
                    query = this.params.query;
                var config = TableConfig.InventoryOrders;
                return TableConfig.getData(query, config);
            }
        });
        this.route("inventoryOrdersItem", {
            path: "/inventoryOrders/:id",
            waitOn: function () {
                return [Meteor.subscribe('inventoryOrders'), Meteor.subscribe('suppliers'), Meteor.subscribe('items')];
            },
            data: function () {
                var config = FormConfig.InventoryOrders;
                return FormConfig.getData(this.params, config);
            }
        });
    });

    var prepareView = function () {
        if($('#navbar').attr('aria-expanded') != 'true')
            return;
        $('.navbar-toggle').click();
    };
    Router.onAfterAction(prepareView);

    var signInRequired = function () {
        if (Meteor.user()) {
            if (this.next) {
                return this.next();
            }
        }
        return Router.go('home');
    };

    var publicRoutes = _.union(Config.publicRoutes, ['entrySignIn', 'entrySignUp', 'entryForgotPassword']);

    Router.onBeforeAction(signInRequired, {
        except: publicRoutes
    });

    var signInProhibited = function () {
        if (Meteor.user()) {
            return Router.go('inventory');
        } else {
            if (this.next) {
                return this.next();
            }
        }
    };

    Router.onBeforeAction(signInProhibited, {
        only: ['home','entrySignUp', 'entrySignUp', 'entryForgotPassword']
    });
}).call(this);
