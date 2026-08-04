"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSetupStatusHandler = getSetupStatusHandler;
exports.saveSetupStepHandler = saveSetupStepHandler;
exports.finishSetupHandler = finishSetupHandler;
let setupState = {
    isCompleted: false,
    step: 1,
    data: {
        hostname: 'vps-prod-01',
        adminUsername: 'admin',
        adminEmail: 'admin@lightpanel.dev',
        databaseUrl: 'postgres://postgres:postgres@localhost:5432/lightpanel',
        redisUrl: 'redis://localhost:6379',
        mailDomain: 'lightpanel.dev',
        enableSSLAuto: true,
        quotaDefault: -1, // Unlimited by default
        analyticsEnabled: true,
    },
};
async function getSetupStatusHandler(req, res) {
    return res.json({
        success: true,
        data: setupState,
    });
}
async function saveSetupStepHandler(req, res) {
    const { step, data } = req.body;
    setupState = {
        ...setupState,
        step: Math.min(10, step || setupState.step + 1),
        data: { ...setupState.data, ...data },
    };
    if (step === 10) {
        setupState.isCompleted = true;
    }
    return res.json({
        success: true,
        data: setupState,
    });
}
async function finishSetupHandler(req, res) {
    setupState.isCompleted = true;
    return res.json({
        success: true,
        message: 'LightPanel setup successfully completed!',
        data: setupState,
    });
}
