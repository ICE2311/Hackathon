import {
  PrismaClient,
  UserRole,
  EquipmentStatus,
  MaintenanceType,
  RequestStage,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.requestLog.deleteMany();
  await prisma.maintenanceRequest.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.maintenanceTeam.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users (one per role)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gearguard.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@gearguard.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Manager',
      role: UserRole.MANAGER,
    },
  });

  const technician1 = await prisma.user.create({
    data: {
      email: 'tech1@gearguard.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Technician',
      role: UserRole.TECHNICIAN,
    },
  });

  const technician2 = await prisma.user.create({
    data: {
      email: 'tech2@gearguard.com',
      password: hashedPassword,
      firstName: 'Mike',
      lastName: 'Smith',
      role: UserRole.TECHNICIAN,
    },
  });

  const technician3 = await prisma.user.create({
    data: {
      email: 'tech3@gearguard.com',
      password: hashedPassword,
      firstName: 'Emma',
      lastName: 'Johnson',
      role: UserRole.TECHNICIAN,
    },
  });

  const employee = await prisma.user.create({
    data: {
      email: 'employee@gearguard.com',
      password: hashedPassword,
      firstName: 'Bob',
      lastName: 'Employee',
      role: UserRole.EMPLOYEE,
    },
  });

  console.log('✅ Created users');

  // Create Maintenance Teams
  const electricalTeam = await prisma.maintenanceTeam.create({
    data: {
      name: 'Electrical Team',
      members: {
        connect: [{ id: technician1.id }, { id: manager.id }],
      },
    },
  });

  const mechanicalTeam = await prisma.maintenanceTeam.create({
    data: {
      name: 'Mechanical Team',
      members: {
        connect: [{ id: technician2.id }, { id: manager.id }],
      },
    },
  });

  const itTeam = await prisma.maintenanceTeam.create({
    data: {
      name: 'IT Team',
      members: {
        connect: [{ id: technician3.id }, { id: manager.id }],
      },
    },
  });

  console.log('✅ Created maintenance teams');

  // Create Equipment
  const equipment1 = await prisma.equipment.create({
    data: {
      name: 'Industrial Printer A1',
      serialNumber: 'PRINT-001',
      department: 'Production',
      assignedEmployeeId: employee.id,
      purchaseDate: new Date('2022-01-15'),
      warrantyExpiry: new Date('2025-01-15'),
      location: 'Building A - Floor 2',
      category: 'Printing Equipment',
      defaultMaintenanceTeamId: electricalTeam.id,
      defaultTechnicianId: technician1.id,
      status: EquipmentStatus.ACTIVE,
    },
  });

  const equipment2 = await prisma.equipment.create({
    data: {
      name: 'CNC Machine M200',
      serialNumber: 'CNC-M200-001',
      department: 'Manufacturing',
      purchaseDate: new Date('2021-06-10'),
      warrantyExpiry: new Date('2024-06-10'),
      location: 'Building B - Workshop',
      category: 'Machining Equipment',
      defaultMaintenanceTeamId: mechanicalTeam.id,
      defaultTechnicianId: technician2.id,
      status: EquipmentStatus.ACTIVE,
    },
  });

  const equipment3 = await prisma.equipment.create({
    data: {
      name: 'Server Rack SR-01',
      serialNumber: 'SRV-RACK-001',
      department: 'IT',
      purchaseDate: new Date('2023-03-20'),
      warrantyExpiry: new Date('2026-03-20'),
      location: 'Data Center',
      category: 'IT Infrastructure',
      defaultMaintenanceTeamId: itTeam.id,
      defaultTechnicianId: technician3.id,
      status: EquipmentStatus.ACTIVE,
    },
  });

  const equipment4 = await prisma.equipment.create({
    data: {
      name: 'Conveyor Belt CB-5',
      serialNumber: 'CONV-005',
      department: 'Production',
      assignedEmployeeId: employee.id,
      purchaseDate: new Date('2020-11-05'),
      warrantyExpiry: new Date('2023-11-05'),
      location: 'Building A - Floor 1',
      category: 'Material Handling',
      defaultMaintenanceTeamId: mechanicalTeam.id,
      defaultTechnicianId: technician2.id,
      status: EquipmentStatus.ACTIVE,
    },
  });

  const equipment5 = await prisma.equipment.create({
    data: {
      name: 'HVAC Unit H-12',
      serialNumber: 'HVAC-012',
      department: 'Facilities',
      purchaseDate: new Date('2019-08-15'),
      warrantyExpiry: new Date('2024-08-15'),
      location: 'Building C - Roof',
      category: 'Climate Control',
      defaultMaintenanceTeamId: electricalTeam.id,
      defaultTechnicianId: technician1.id,
      status: EquipmentStatus.ACTIVE,
    },
  });

  const equipment6 = await prisma.equipment.create({
    data: {
      name: 'Forklift FL-03',
      serialNumber: 'FORK-003',
      department: 'Warehouse',
      purchaseDate: new Date('2022-05-10'),
      warrantyExpiry: new Date('2025-05-10'),
      location: 'Warehouse A',
      category: 'Material Handling',
      defaultMaintenanceTeamId: mechanicalTeam.id,
      status: EquipmentStatus.ACTIVE,
    },
  });

  const equipment7 = await prisma.equipment.create({
    data: {
      name: 'Laptop Dell XPS 15',
      serialNumber: 'LAPTOP-XPS-042',
      department: 'IT',
      assignedEmployeeId: employee.id,
      purchaseDate: new Date('2023-09-01'),
      warrantyExpiry: new Date('2026-09-01'),
      location: 'Office Building - Desk 42',
      category: 'Computing Equipment',
      defaultMaintenanceTeamId: itTeam.id,
      defaultTechnicianId: technician3.id,
      status: EquipmentStatus.ACTIVE,
    },
  });

  const equipment8 = await prisma.equipment.create({
    data: {
      name: 'Welding Machine WM-7',
      serialNumber: 'WELD-007',
      department: 'Manufacturing',
      purchaseDate: new Date('2021-02-20'),
      warrantyExpiry: new Date('2024-02-20'),
      location: 'Building B - Workshop',
      category: 'Welding Equipment',
      defaultMaintenanceTeamId: mechanicalTeam.id,
      status: EquipmentStatus.ACTIVE,
    },
  });

  const equipment9 = await prisma.equipment.create({
    data: {
      name: 'Generator GEN-2',
      serialNumber: 'GEN-002',
      department: 'Facilities',
      purchaseDate: new Date('2020-04-10'),
      warrantyExpiry: new Date('2025-04-10'),
      location: 'Building D - Basement',
      category: 'Power Equipment',
      defaultMaintenanceTeamId: electricalTeam.id,
      defaultTechnicianId: technician1.id,
      status: EquipmentStatus.ACTIVE,
    },
  });

  const equipment10 = await prisma.equipment.create({
    data: {
      name: 'Air Compressor AC-4',
      serialNumber: 'COMP-004',
      department: 'Production',
      purchaseDate: new Date('2021-07-15'),
      warrantyExpiry: new Date('2024-07-15'),
      location: 'Building A - Utility Room',
      category: 'Pneumatic Equipment',
      defaultMaintenanceTeamId: mechanicalTeam.id,
      status: EquipmentStatus.ACTIVE,
    },
  });

  console.log('✅ Created equipment');

  // Create Maintenance Requests
  const request1 = await prisma.maintenanceRequest.create({
    data: {
      subject: 'Printer paper jam issue',
      description:
        'Industrial printer experiencing frequent paper jams. Needs inspection and cleaning.',
      type: MaintenanceType.CORRECTIVE,
      equipmentId: equipment1.id,
      maintenanceTeamId: electricalTeam.id,
      assignedTechnicianId: technician1.id,
      stage: RequestStage.IN_PROGRESS,
      createdById: employee.id,
    },
  });

  const request2 = await prisma.maintenanceRequest.create({
    data: {
      subject: 'CNC Machine quarterly maintenance',
      description:
        'Scheduled quarterly preventive maintenance for CNC machine.',
      type: MaintenanceType.PREVENTIVE,
      equipmentId: equipment2.id,
      maintenanceTeamId: mechanicalTeam.id,
      assignedTechnicianId: technician2.id,
      scheduledDate: new Date('2025-01-15'),
      stage: RequestStage.NEW,
      createdById: manager.id,
    },
  });

  const request3 = await prisma.maintenanceRequest.create({
    data: {
      subject: 'Server cooling fan replacement',
      description:
        'Server rack cooling fan making unusual noise. Requires replacement.',
      type: MaintenanceType.CORRECTIVE,
      equipmentId: equipment3.id,
      maintenanceTeamId: itTeam.id,
      stage: RequestStage.NEW,
      createdById: employee.id,
    },
  });

  const request4 = await prisma.maintenanceRequest.create({
    data: {
      subject: 'Conveyor belt alignment',
      description: 'Conveyor belt is misaligned and causing production delays.',
      type: MaintenanceType.CORRECTIVE,
      equipmentId: equipment4.id,
      maintenanceTeamId: mechanicalTeam.id,
      assignedTechnicianId: technician2.id,
      stage: RequestStage.REPAIRED,
      durationHours: 3.5,
      createdById: employee.id,
    },
  });

  const request5 = await prisma.maintenanceRequest.create({
    data: {
      subject: 'HVAC filter replacement',
      description: 'Monthly preventive maintenance - replace air filters.',
      type: MaintenanceType.PREVENTIVE,
      equipmentId: equipment5.id,
      maintenanceTeamId: electricalTeam.id,
      scheduledDate: new Date('2025-02-01'),
      stage: RequestStage.NEW,
      createdById: manager.id,
    },
  });

  const request6 = await prisma.maintenanceRequest.create({
    data: {
      subject: 'Forklift brake inspection',
      description: 'Overdue preventive maintenance - brake system inspection.',
      type: MaintenanceType.PREVENTIVE,
      equipmentId: equipment6.id,
      maintenanceTeamId: mechanicalTeam.id,
      scheduledDate: new Date('2024-12-20'), // Past date to test overdue
      stage: RequestStage.NEW,
      createdById: manager.id,
    },
  });

  console.log('✅ Created maintenance requests');

  // Create some request logs
  await prisma.requestLog.create({
    data: {
      requestId: request1.id,
      action: 'ASSIGNED',
      note: 'Assigned to John Technician',
      userId: manager.id,
    },
  });

  await prisma.requestLog.create({
    data: {
      requestId: request4.id,
      action: 'COMPLETED',
      note: 'Conveyor belt realigned and tested successfully',
      userId: technician2.id,
    },
  });

  console.log('✅ Created request logs');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📧 Test User Credentials:');
  console.log('Admin: admin@gearguard.com / password123');
  console.log('Manager: manager@gearguard.com / password123');
  console.log('Technician 1: tech1@gearguard.com / password123');
  console.log('Technician 2: tech2@gearguard.com / password123');
  console.log('Technician 3: tech3@gearguard.com / password123');
  console.log('Employee: employee@gearguard.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
