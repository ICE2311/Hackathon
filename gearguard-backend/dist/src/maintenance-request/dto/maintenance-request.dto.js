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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStageDto = exports.AssignTechnicianDto = exports.UpdateMaintenanceRequestDto = exports.CreateMaintenanceRequestDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateMaintenanceRequestDto {
    subject;
    description;
    type;
    equipmentId;
    maintenanceTeamId;
    assignedTechnicianId;
    scheduledDate;
    durationHours;
}
exports.CreateMaintenanceRequestDto = CreateMaintenanceRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceRequestDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceRequestDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.MaintenanceType),
    __metadata("design:type", String)
], CreateMaintenanceRequestDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateMaintenanceRequestDto.prototype, "equipmentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMaintenanceRequestDto.prototype, "maintenanceTeamId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMaintenanceRequestDto.prototype, "assignedTechnicianId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMaintenanceRequestDto.prototype, "scheduledDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMaintenanceRequestDto.prototype, "durationHours", void 0);
class UpdateMaintenanceRequestDto {
    subject;
    description;
    type;
    equipmentId;
    maintenanceTeamId;
    assignedTechnicianId;
    scheduledDate;
    durationHours;
    stage;
}
exports.UpdateMaintenanceRequestDto = UpdateMaintenanceRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMaintenanceRequestDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMaintenanceRequestDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.MaintenanceType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMaintenanceRequestDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMaintenanceRequestDto.prototype, "equipmentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMaintenanceRequestDto.prototype, "maintenanceTeamId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMaintenanceRequestDto.prototype, "assignedTechnicianId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMaintenanceRequestDto.prototype, "scheduledDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateMaintenanceRequestDto.prototype, "durationHours", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.RequestStage),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMaintenanceRequestDto.prototype, "stage", void 0);
class AssignTechnicianDto {
    technicianId;
}
exports.AssignTechnicianDto = AssignTechnicianDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AssignTechnicianDto.prototype, "technicianId", void 0);
class UpdateStageDto {
    stage;
    note;
    durationHours;
}
exports.UpdateStageDto = UpdateStageDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.RequestStage),
    __metadata("design:type", String)
], UpdateStageDto.prototype, "stage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStageDto.prototype, "note", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateStageDto.prototype, "durationHours", void 0);
//# sourceMappingURL=maintenance-request.dto.js.map