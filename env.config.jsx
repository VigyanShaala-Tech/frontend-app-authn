import React from "react";
import {PLUGIN_OPERATIONS, DIRECT_PLUGIN} from "@openedx/frontend-plugin-framework";
import { CustomLargeLayout, CustomMediumLayout, CustomSmallLayout } from "./src/base-container/components/custom-layout";
import  CustomMainAppRoutes  from "./src/CustomMainAppRoutes";
import CustomFormGroup from "./src/common-components/CustomFormGroup"

const getPluginSlots = () => {
    return {
        main_app_plugin_slot: {
            plugins: [
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget:{
                        id: "main_app_plugin_slot",
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: (props)=>(
                            <CustomMainAppRoutes />
                        )
                    }
                }
            ]
        },
        custom_form_group_plugin_slot: {
            plugins: [
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget:{
                        id: "custom_form_group_plugin_slot",
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: (props)=>(
                            <CustomFormGroup/>
                        )
                    }
                }
            ]
        },
        custom_large_layout_plugin_slot: {
            plugins: [
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget:{
                        id: "custom_large_layout_plugin_slot",
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: (props)=>(
                            <CustomLargeLayout/>
                        )
                    }
                }
            ]
        },
        custom_medium_layout_plugin_slot: {
            plugins: [
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget:{
                        id: "custom_medium_layout_plugin_slot",
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: (props)=>(
                            <CustomMediumLayout/>
                        )
                    }
                }
            ]
        },
        custom_small_layout_plugin_slot: {
            plugins: [
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget:{
                        id: "custom_small_layout_plugin_slot",
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: (props)=>(
                            <CustomSmallLayout/>
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