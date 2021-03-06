Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('Carto', '../../src/');

Ext.require([
    'Carto.CartoMap',
    'Ext.data.Store'
]);



var mapController = Ext.create('Ext.app.ViewController',{
    filterStore: function(combo, record){
        if (record) {
            this.getStore('layer').filter([{
                property: 'city',
                value: record,
                operator: 'like'
            }]);
        } else {
            this.clearFilter();
        }
    },
    clearFilter: function(){
        this.lookup('comboFilter').reset();
        this.getStore('layer').clearFilter();
    }
});

Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'panel',
            layout: 'border',
            viewModel: {
                stores: {
                    layer: {
                        storeId: 'layer1',
                        type: 'carto',
                        autoLoad: true,
                        proxy: {
                            username: 'extjscarto',
                            table: 'us_metro_stations'
                        }
                    },
                    combo: {
                        type: 'carto',
                        sorters: 'city',
                        proxy: {
                            username: 'extjscarto',
                            table: 'us_metro_stations',
                            groupBy: 'city'
                        }
                    }
                }
            },
            controller: mapController,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    text: 'View Code',
                },{
                    xtype: 'combo',
                    fieldLabel: "City Filters",
                    reference: 'comboFilter',
                    displayField: 'city',
                    valueField: 'city',
                    bind: {
                        store: '{combo}'
                    },
                    listeners: {
                        change: 'filterStore'
                    }
                },{
                    xtype: 'button',
                    text: 'Clear Filter',
                    handler: 'clearFilter'
                }]
            }],            
            items: [{
                xtype: "cartomap",
                region: 'center',
                center: 'us',
                reference: 'map',
                basemap: 'darkMatterLite',
                layers: [{
                    subLayers: [{
                        bind: '{layer}'
                    }]
                }]
            },{
                xtype: 'grid',
                region: 'south',
                reference: 'southGrid',
                split: true,
                height: 350,
                plugins: 'gridfilters',
                bind: {
                    store: '{layer}'
                },
                columns: [
                    { text: 'City', dataIndex: 'city', flex: 1, filter: {
                        type: 'string',
                        itemDefaults: {
                            emptyText: 'Search for...'
                        }
                    }  },
                    { text: 'Name', dataIndex: 'name', flex: 2 }
                ],
            }]
        }]
    });
});