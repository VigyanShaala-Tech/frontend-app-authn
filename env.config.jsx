import React from "react";
import {PLUGIN_OPERATIONS, DIRECT_PLUGIN} from "@openedx/frontend-plugin-framework";
import CustomRegistrationPage from "./src/register/CustomRegistrationPage";

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