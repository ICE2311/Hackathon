"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceRequestModule = void 0;
const common_1 = require("@nestjs/common");
const maintenance_request_service_1 = require("./maintenance-request.service");
const maintenance_request_controller_1 = require("./maintenance-request.controller");
let MaintenanceRequestModule = class MaintenanceRequestModule {
};
exports.MaintenanceRequestModule = MaintenanceRequestModule;
exports.MaintenanceRequestModule = MaintenanceRequestModule = __decorate([
    (0, common_1.Module)({
        controllers: [maintenance_request_controller_1.MaintenanceRequestController],
        providers: [maintenance_request_service_1.MaintenanceRequestService],
        exports: [maintenance_request_service_1.MaintenanceRequestService],
    })
], MaintenanceRequestModule);
//# sourceMappingURL=maintenance-request.module.js.map