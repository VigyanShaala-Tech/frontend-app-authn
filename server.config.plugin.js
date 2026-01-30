from tutor import hooks

hooks.Filters.ENV_PATCHES.add_item(
    (
        "mfe-env-config-runtime-definitions-authn",
        """
// Runtime plugin configuration injected by Tutor (auth / login & registration overrides)

const { PLUGIN_OPERATIONS, DIRECT_PLUGIN } = await import('@openedx/frontend-plugin-framework');
const { default: CustomRegistrationPage } = await import('./src/register/CustomRegistrationPage');
const { default: CustomLoginPage } = await import('./src/login/CustomLoginPage');

{% raw %}
const getPluginSlots = () => {
  return {
    registration_plugin_slot: {
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'registration_plugin_slot',
            type: DIRECT_PLUGIN,
            priority: 1,
            RenderWidget: (props) => <CustomRegistrationPage {...props} />,
          },
        },
      ],
    },
    login_plugin_slot: {
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'login_plugin_slot',
            type: DIRECT_PLUGIN,
            priority: 1,
            RenderWidget: (props) => <CustomLoginPage {...props} />,
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