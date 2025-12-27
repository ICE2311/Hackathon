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
exports.MaintenanceTeamController = void 0;
const common_1 = require("@nestjs/common");
const maintenance_team_service_1 = require("./maintenance-team.service");
const maintenance_team_dto_1 = require("./dto/maintenance-team.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let MaintenanceTeamController = class MaintenanceTeamController {
    maintenanceTeamService;
    constructor(maintenanceTeamService) {
        this.maintenanceTeamService = maintenanceTeamService;
    }
    create(createMaintenanceTeamDto) {
        return this.maintenanceTeamService.create(createMaintenanceTeamDto);
    }
    findAll() {
        return this.maintenanceTeamService.findAll();
    }
    findOne(id) {
        return this.maintenanceTeamService.findOne(id);
    }
    update(id, updateMaintenanceTeamDto) {
        return this.maintenanceTeamService.update(id, updateMaintenanceTeamDto);
    }
    remove(id) {
        return this.maintenanceTeamService.remove(id);
    }
    addMember(id, userId) {
        return this.maintenanceTeamService.addMember(id, userId);
    }
    removeMember(id, userId) {
        return this.maintenanceTeamService.removeMember(id, userId);
    }
};
exports.MaintenanceTeamController = MaintenanceTeamController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [maintenance_team_dto_1.CreateMaintenanceTeamDto]),
    __metadata("design:returntype", void 0)
], MaintenanceTeamController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MaintenanceTeamController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaintenanceTeamController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, maintenance_team_dto_1.UpdateMaintenanceTeamDto]),
    __metadata("design:returntype", void 0)
], MaintenanceTeamController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaintenanceTeamController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MaintenanceTeamController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':id/members/:userId'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MaintenanceTeamController.prototype, "removeMember", null);
exports.MaintenanceTeamController = MaintenanceTeamController = __decorate([
    (0, common_1.Controller)('maintenance-teams'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [maintenance_team_service_1.MaintenanceTeamService])
], MaintenanceTeamController);
//# sourceMappingURL=maintenance-team.controller.js.map