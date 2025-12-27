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
exports.UpdateEquipmentDto = exports.CreateEquipmentDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateEquipmentDto {
    name;
    serialNumber;
    department;
    assignedEmployeeId;
    purchaseDate;
    warrantyExpiry;
    location;
    category;
    defaultMaintenanceTeamId;
    defaultTechnicianId;
    status;
}
exports.CreateEquipmentDto = CreateEquipmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "serialNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "department", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "assignedEmployeeId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "purchaseDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "warrantyExpiry", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "defaultMaintenanceTeamId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "defaultTechnicianId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.EquipmentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "status", void 0);
class UpdateEquipmentDto {
    name;
    serialNumber;
    department;
    assignedEmployeeId;
    purchaseDate;
    warrantyExpiry;
    location;
    category;
    defaultMaintenanceTeamId;
    defaultTechnicianId;
    status;
}
exports.UpdateEquipmentDto = UpdateEquipmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEquipmentDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEquipmentDto.prototype, "serialNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEquipmentDto.prototype, "department", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEquipmentDto.prototype, "assignedEmployeeId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEquipmentDto.prototype, "purchaseDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEquipmentDto.prototype, "warrantyExpiry", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEquipmentDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEquipmentDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEquipmentDto.prototype, "defaultMaintenanceTeamId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEquipmentDto.prototype, "defaultTechnicianId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.EquipmentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEquipmentDto.prototype, "status", void 0);
//# sourceMappingURL=equipment.dto.js.map