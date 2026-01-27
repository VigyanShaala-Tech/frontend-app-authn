import React from "react";
import {PLUGIN_OPERATIONS, DIRECT_PLUGIN} from "@openedx/frontend-plugin-framework";
import CustomRegistrationPage from "./src/register/CustomRegistrationPage";
import CustomLoginPage from "./src/login/CustomLoginPage";

const getPluginSlots = () => {
    return {
        registration_plugin_slot: {
            plugins: [
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget:{
                        id: "registration_plugin_slot",
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: (props)=>(
                            <CustomRegistrationPage />
                        )
                    }
                }
            ]
        },
        login_plugin_slot: {
            plugins: [
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget:{
                        id: "login_plugin_slot",
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: (props)=>(
                            <CustomLoginPage />
                        )
                    }
                }
            ]
        }
    }
}

const config = {
    ...process.env,
    get pluginSlots() {
        return getPluginSlots();
    }
}

export default config;