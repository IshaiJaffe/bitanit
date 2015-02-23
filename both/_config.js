
this.Config = {
    name: 'Bitanit',
    title: 'Electricity in a box',
    subtitle: '',
    logo: function () {
        return '<b>' + this.name + '</b>';
    },
    footer: function () {
        return this.name + ' - Copyright ' + new Date().getFullYear();
    },
    emails: {
        from: 'noreply@' + Meteor.absoluteUrl()
    },
    username: false,
    homeRoute: '/',
    dashboardRoute: '/inventory',
    publicRoutes: ['home']
};
