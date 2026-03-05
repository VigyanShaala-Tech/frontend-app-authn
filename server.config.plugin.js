from tutor import hooks

hooks.Filters.ENV_PATCHES.add_item(
    (
        "mfe-env-config-runtime-definitions-authn",
        """
// Runtime plugin configuration injected by Tutor (auth / login & registration overrides)

const { PLUGIN_OPERATIONS, DIRECT_PLUGIN } = await import('@openedx/frontend-plugin-framework');
const { default: CustomLargeLayout }     = await import('./src/base-container/components/custom-layout');
const { default: CustomMediumLayout }    = await import('./src/base-container/components/custom-layout');
const { default: CustomSmallLayout }     = await import('./src/base-container/components/custom-layout');
const { default: CustomMainAppRoutes }   = await import('./src/CustomMainAppRoutes');
const { default: CustomFormGroup }       = await import('./src/common-components/CustomFormGroup');

{% raw %}
const getPluginSlots = () => {
  return {
    main_app_plugin_slot: {
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'main_app_plugin_slot',
            type: DIRECT_PLUGIN,
            priority: 1,
            RenderWidget: (props) => <CustomMainAppRoutes {...props} />,
          },
        },
      ],
    },

    custom_form_group_plugin_slot: {
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'custom_form_group_plugin_slot',
            type: DIRECT_PLUGIN,
            priority: 1,
            RenderWidget: (props) => <CustomFormGroup {...props} />,
          },
        },
      ],
    },

    custom_large_layout_plugin_slot: {
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'custom_large_layout_plugin_slot',
            type: DIRECT_PLUGIN,
            priority: 1,
            RenderWidget: (props) => <CustomLargeLayout {...props} />,
          },
        },
      ],
    },

    custom_medium_layout_plugin_slot: {
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'custom_medium_layout_plugin_slot',
            type: DIRECT_PLUGIN,
            priority: 1,
            RenderWidget: (props) => <CustomMediumLayout {...props} />,
          },
        },
      ],
    },

    custom_small_layout_plugin_slot: {
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'custom_small_layout_plugin_slot',
            type: DIRECT_PLUGIN,
            priority: 1,
            RenderWidget: (props) => <CustomSmallLayout {...props} />,
          },
        },
      ],
    },
  };
};

// Attach plugin slots to runtime config
config.pluginSlots = getPluginSlots();
{% endraw %}
"""
    )
)