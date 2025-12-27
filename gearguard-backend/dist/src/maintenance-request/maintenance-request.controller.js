"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceRequestController = void 0;
const common_1 = require("@nestjs/common");
const maintenance_request_service_1 = require("./maintenance-request.service");
const maintenance_request_dto_1 = require("./dto/maintenance-request.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let MaintenanceRequestController = class MaintenanceRequestController {
    maintenanceRequestService;
    constructor(maintenanceRequestService) {
        this.maintenanceRequestService = maintenanceRequestService;
    }
    create(createDto, req) {
        return this.maintenanceRequestService.create(createDto, req.user.id);
    }
    findAll(type, stage, maintenanceTeamId, equipmentId) {
        return this.maintenanceRequestService.findAll({
            type,
            stage,
            maintenanceTeamId,
            equipmentId,
        });
    }
    getKanbanData() {
        return this.maintenanceRequestService.getKanbanData();
    }
    getCalendarData(startDate, endDate) {
        return this.maintenanceRequestService.getCalendarData(startDate, endDate);
    }
    getMetrics(month, year) {
        return this.maintenanceRequestService.getMetrics(month, year);
    }
    findOne(id) {
        return this.maintenanceRequestService.findOne(id);
    }
    update(id, updateDto) {
        return this.maintenanceRequestService.update(id, updateDto);
    }
    assignTechnician(id, assignDto, req) {
        return this.maintenanceRequestService.assignTechnician(id, assignDto, req.user.id);
    }
    updateStage(id, updateStageDto, req) {
        return this.maintenanceRequestService.updateStage(id, updateStageDto, req.user.id);
    }
    remove(id) {
        return this.maintenanceRequestService.remove(id);
    }
};
exports.MaintenanceRequestController = MaintenanceRequestController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [maintenance_request_dto_1.CreateMaintenanceRequestDto, Object]),
    __metadata("design:returntype", void 0)
], MaintenanceRequestController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('stage')),
    __param(2, (0, common_1.Query)('maintenanceTeamId')),
    __param(3, (0, common_1.Query)('equipmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], MaintenanceRequestController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('kanban'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MaintenanceRequestController.prototype, "getKanbanData", null);
__decorate([
    (0, common_1.Get)('calendar'),
    __param(0, (0, common_1.Query)('start')),
    __param(1, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MaintenanceRequestController.prototype, "getCalendarData", null);
__decorate([
    (0, common_1.Get)('metrics'),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MaintenanceRequestController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaintenanceRequestController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER, client_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, maintenance_request_dto_1.UpdateMaintenanceRequestDto]),
    __metadata("design:returntype", void 0)
], MaintenanceRequestController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER, client_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, maintenance_request_dto_1.AssignTechnicianDto, Object]),
    __metadata("design:returntype", void 0)
], MaintenanceRequestController.prototype, "assignTechnician", null);
__decorate([
    (0, common_1.Patch)(':id/stage'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER, client_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, maintenance_request_dto_1.UpdateStageDto, Object]),
    __metadata("design:returntype", void 0)
], MaintenanceRequestController.prototype, "updateStage", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaintenanceRequestController.prototype, "remove", null);
exports.MaintenanceRequestController = MaintenanceRequestController = __decorate([
    (0, common_1.Controller)('maintenance-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [maintenance_request_service_1.MaintenanceRequestService])
], MaintenanceRequestController);
//# sourceMappingURL=maintenance-request.controller.js.map